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

        // Toggle outOfStock
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { outOfStock: !product.outOfStock },
            { new: true }
        );

        return NextResponse.json({
            success: true,
            message: updatedProduct.outOfStock ? "Product marked as Out of Stock" : "Product marked as In Stock",
            product: updatedProduct
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}
