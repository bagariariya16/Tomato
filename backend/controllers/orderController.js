import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
// import Stripe from "stripe"

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

// Initialize Razorpay with key ID and secret
const razorpay = new Razorpay({
    key_id: process.env.REACT_APP_RAZORPAY_KEY_ID,
    key_secret: process.env.REACT_APP_RAZORPAY_SECRET_KEY,
});

//placing user order for frontend
const placeOrder = async (req, res) => {
    console.log("in placeOrder");
    const frontend_url = "http://localhost:5173";
    try {
        const newOrder = new orderModel({
            userId: req.body.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address
        })

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

        const line_items = req.body.items.map((item) => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name
                },
                unit_amount: item.price * 100 * 80
            },
            quantity: item.quantity
        }))
        line_items.push({
            price_data: {
                currency: "inr",
                product_data: {
                    name: "Delivery Charges"
                },
                unit_amount: 2 * 100 * 80
            },
            quantity: 1

        })

        const amountInPaise = (req.body.amount + 2) * 100;

        // Create Razorpay order
        const options = {
            amount: amountInPaise, // amount in paise
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
            payment_capture: 1, // Auto-capture payment
        };
        const razorpayOrder = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: razorpayOrder.id,  // Razorpay order ID
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
        });

        // const session = await stripe.checkout.session.create({
        //     line_items: line_items,
        //     mode: 'payment',
        //     success_url: `${frontend_url}/verify?success=true&orderId=${newOrder}`
        // })
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error placing order"
        });
    }
}

const verifyOrder = async (req, res) => {
    // const { orderId, success } = req.body;
    // try {
    //     if (success === "true") {
    //         await orderModel.findByIdAndUpdate(orderId, { payment: true });
    //         res.json({
    //             success: true,
    //             message: "Paid"
    //         })

    //     }
    //     else {
    //         await orderModel.findByIdAndDelete(orderId);
    //         res.json({
    //             success: false,
    //             message: "Not Paid"
    //         })
    //     }
    // } catch (error) {
    //     console.log(error);
    //     res.json({
    //         success:false,
    //         message:"Error"
    //     })
    // }
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    const secret = process.env.RAZORPAY_SECRET_KEY;

    // Create the expected signature
    const generated_signature = crypto.createHmac('sha256', secret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest('hex');

    if (generated_signature === razorpay_signature) {
        // Payment successful, update order in database
        await orderModel.findByIdAndUpdate(req.body.orderId, { payment: true });
        res.json({
            success: true,
            message: "Payment verified and order completed"
        });
    } else {
        // Payment failed, delete order
        await orderModel.findByIdAndDelete(req.body.orderId);
        res.json({
            success: false,
            message: "Payment verification failed"
        });
    }

}

//user orders for frontend
const userOrders = async(req,res) =>{
    try {
        const orders = await orderModel.find({userId:req.body.userId})
        res.json({
            success:true,
            data:orders
        })  
    } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
        
    }
}
export { placeOrder, verifyOrder,userOrders } 