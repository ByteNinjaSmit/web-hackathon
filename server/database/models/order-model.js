const { Schema, model, default: mongoose } = require("mongoose");

// Sub-schema for individual ordered items
const orderProductSchema = new Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

// Main Order Schema
const orderSchema = new Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendors",
      required: true,
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users", // Reference the User model
      required: true,
    },
    products: {
      type: [orderProductSchema],
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
      set: (v) => Math.round(v * 100) / 100, // Round to 2 decimal places
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Unpaid"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online", "Counter", "Pending", "Razorpay"],
      default: "Cash",
    },
    paymentId: {
      type: String,
      default: "",
    },
    paymentOrderId: {
      type: String,
      default: "",
    },
    trackId: {
      type: String,
      default: "",
    },
    pickupTime: {
      type: Date,
    },
    deliveryTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["Not Process", "Processing", "Delivered", "Cancelled"],
      default: "Not Process",
    },
    deliveryType: {
      type: String,
      enum: ["Pickup", "Onspot", "Delivery"],
      default: "Pickup",
    },
    discount: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    isReviewed: { type: Boolean, default: false },
    buyerContactSnapshot: {
      name: String,
      phone: String,
    },
    pickupCoordinates: {
      lat: Number,
      lng: Number,
    },
    isCancelledBy: {
      type: String,
      enum: ["user", "vendor", "system", ""],
      default: "",
    },
  },
  { timestamps: true }
);

const Order = new mongoose.model("Order", orderSchema);
module.exports = Order;
