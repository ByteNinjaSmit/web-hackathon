const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment-controller");
const authMiddleware = require("../middlewares/auth-middleware");

// Get Razorpay API key
router.get("/get-api-key", paymentController.getRazorApiKey);

// Create new Razorpay order
router.post("/razorpay/new", paymentController.onlineRazorPayment);

// Verify Razorpay payment
router.post("/verify-payment", paymentController.RazorPaymentVerification);

module.exports = router;