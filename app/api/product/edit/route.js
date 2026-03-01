import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "not authorized" });
        }

        const formData = await request.formData();

        const productId = formData.get('productId');
        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = formData.get('price');
        const offerPrice = formData.get('offerPrice');
        const existingImages = JSON.parse(formData.get('existingImages') || '[]');
        const files = formData.getAll('images');

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }

        await connectDB();

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" });
        }

        // Verify ownership
        if (product.userId !== userId) {
            return NextResponse.json({ success: false, message: "not authorized" });
        }

        // Upload new images to Cloudinary if any
        let newImageUrls = [];
        if (files && files.length > 0 && files[0].size > 0) {
            const results = await Promise.all(
                files.map(async (file) => {
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    return new Promise((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { resource_type: 'auto' },
                            (error, result) => {
                                if (error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        );
                        stream.end(buffer);
                    });
                })
            );
            newImageUrls = results.map((r) => r.secure_url);
        }

        // Combine existing images with newly uploaded ones
        const finalImages = [...existingImages, ...newImageUrls];

        // Delete removed images from Cloudinary
        const removedImages = product.image.filter((img) => !existingImages.includes(img));
        if (removedImages.length > 0) {
            await Promise.all(
                removedImages.map(async (imageUrl) => {
                    try {
                        const parts = imageUrl.split('/');
                        const fileWithExt = parts[parts.length - 1];
                        const publicId = fileWithExt.split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.error("Error deleting old image from Cloudinary:", err.message);
                    }
                })
            );
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                name,
                description,
                category,
                price: Number(price),
                offerPrice: Number(offerPrice),
                image: finalImages.length > 0 ? finalImages : product.image,
            },
            { new: true }
        );

        return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
