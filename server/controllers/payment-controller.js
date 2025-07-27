require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../database/models/user-model");
const logger = require("../utils/logger");
const Razorpay = require("razorpay");
const axios = require("axios");
const crypto = require("crypto");
const Order = require("../database/models/order-model")


// Instance OF razorPay
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

const paymentSessionMap = new Map();

// For Online Payment
const onlineRazorPayment = async (req, res, next) => {
  try {
    const { userId, amount, orders } = req.body;

    // Validate required fields
    if (!userId || !amount || !orders || !Array.isArray(orders)) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid User Id",
      });
    }

    // Create orders in pending state
    const createdOrders = await Promise.all(
      orders.map(orderData => {
        const order = new Order({
          ...orderData,
          paymentStatus: 'Pending',
          status: 'Not Process'
        });
        return order.save();
      })
    );

    // Razorpay order options
    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`, // Generate a unique receipt ID
    };

    // Create order using Razorpay instance
    const razorpayOrder = await instance.orders.create(options);

    // Store order data for verification
    paymentSessionMap.set(razorpayOrder.id, {
      userId,
      orderIds: createdOrders.map(order => order._id)
    });

    // Respond with the created order details
    res.status(200).json({
      success: true,
      order: razorpayOrder,
    });
  } catch (error) {
    logger.error("Error creating Razorpay order:", error);
    next(error);
  }
};


// For Razorpay Online Payment Final Verification
const RazorPaymentVerification = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Retrieve order data using Map
    const paymentData = paymentSessionMap.get(razorpay_order_id);
    if (!paymentData || !paymentData.orderIds) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment session"
      });
    }

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;
    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });
    }

    // Update all orders associated with this payment
    await Promise.all(
      paymentData.orderIds.map(orderId =>
        Order.findByIdAndUpdate(orderId, {
          paymentStatus: "Paid",
          paymentId: razorpay_payment_id,
          paymentOrderId: razorpay_order_id,
          status: "Processing"
        })
      )
    );

    // Clean up the session data
    paymentSessionMap.delete(razorpay_order_id);

    // Redirect to success page
    return res.redirect(
      `${process.env.CORS_SERVER}/payment-success?reference=${razorpay_payment_id}&orderId=${razorpay_order_id}`
    );

  } catch (error) {
    logger.error("Error verifying Razorpay payment:", error);
    next(error);
  }
};


const getRazorApiKey =async(req,res,next) =>{
  try {
    return res.status(200).json({key: process.env.RAZORPAY_API_KEY});
  } catch (error) {
    next(error);
  }
}


module.exports = {
    getRazorApiKey,
    RazorPaymentVerification,
    onlineRazorPayment
}
