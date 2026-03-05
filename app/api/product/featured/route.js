import connectDB from '@/config/db';
import authSeller from '@/lib/authSeller';
import Product from '@/models/Product';
import { getAuth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function PUT(request) {
    try {
        const { userId } = getAuth(request);

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        const { productId, featuredTitle, featuredDescription } = await request.json();

        if (!productId) {
            return NextResponse.json({ success: false, message: "Product ID is required" });
        }

        await connectDB();

        const product = await Product.findById(productId);

        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" });
        }

        if (product.userId !== userId) {
            return NextResponse.json({ success: false, message: "Not authorized" });
        }

        if (product.featured) {
            // Unmark as featured
            const updated = await Product.findByIdAndUpdate(
                productId,
                { featured: false, featuredTitle: '', featuredDescription: '' },
                { new: true }
            );
            return NextResponse.json({
                success: true,
                message: "Product removed from Featured",
                product: updated
            });
        } else {
            // Check if already 3 featured products
            const featuredCount = await Product.countDocuments({ featured: true });
            if (featuredCount >= 3) {
                return NextResponse.json({
                    success: false,
                    message: "Maximum 3 featured products allowed. Remove one first."
                });
            }

            const updated = await Product.findByIdAndUpdate(
                productId,
                {
                    featured: true,
                    featuredTitle: featuredTitle || product.name,
                    featuredDescription: featuredDescription || product.description
                },
                { new: true }
            );
            return NextResponse.json({
                success: true,
                message: "Product marked as Featured",
                product: updated
            });
        }

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
