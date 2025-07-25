const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Vegetables",
        "Fruits",
        "Dairy",
        "Grains",
        "Spices",
        "Condiments",
        "Meat",
        "Other",
      ],
      default: "Other",
    },
    unit: {
      type: String,
      enum: ["kg", "litre", "packet", "piece", "bottle"],
      default: "kg",
    },
    stockQuantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    pricePerUnit: {
      type: Number,
      required: true,
      min: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
      get() {
        return this.stockQuantity * this.pricePerUnit;
      },
    },
    supplierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendors",
      required: false,
    },
    expiryTime: {
      type: String,
      required: false,
    },
    qualityCheck: {
      passed: { type: Boolean, default: true },
      inspector: { type: String, default: "Auto" },
      notes: { type: String, default: "" },
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    toJSON: { getters: true },
  }
);

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
