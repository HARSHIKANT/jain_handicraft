import connectDB from "@/config/db";
import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {

        const { userId } = getAuth(request);
        const { address, items } = await request.json();

        if(!address || items.length === 0){
            return NextResponse.json({ success: false, message: "Invalid data" })
        }
        await connectDB()

        // calculate total price
        let amount = 0;
for (const item of items) {
  const product = await Product.findById(item.product);
  if (!product) throw new Error(`Product not found: ${item.product}`);
  amount += product.offerPrice * item.quantity;
}

        await inngest.send({
            name: 'order/created',
            data: {
                userId,
                address,
                items,
                amount: amount + Math.floor(amount*0.02),
                date: Date.now()
            }
        })

        // clear user cart
        const user = await User.findById(userId);
        user.cartItems = {};
        await user.save()

        return NextResponse.json({ success: true, message: "Order placed successfully" })

    } catch (error) {
        console.log(error)
        return NextResponse.json({ success: false, message: error.message })
    }

}