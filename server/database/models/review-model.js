const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendors",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String, // Image URLs if users upload food pics
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false, // Set true if review is linked to a real order
    },
  },
  {
    timestamps: true,
  }
);

const Review = new mongoose.model("Review", reviewSchema);
module.exports = Review;
