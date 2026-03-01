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

export async function DELETE(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "not authorized" });
        }

        const { productId } = await request.json();

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

        // Delete images from Cloudinary
        if (product.image && product.image.length > 0) {
            await Promise.all(
                product.image.map(async (imageUrl) => {
                    try {
                        // Extract public_id from Cloudinary URL
                        const parts = imageUrl.split('/');
                        const fileWithExt = parts[parts.length - 1];
                        const publicId = fileWithExt.split('.')[0];
                        await cloudinary.uploader.destroy(publicId);
                    } catch (err) {
                        console.error("Error deleting image from Cloudinary:", err.message);
                    }
                })
            );
        }

        await Product.findByIdAndDelete(productId);

        return NextResponse.json({ success: true, message: "Product deleted successfully" });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
