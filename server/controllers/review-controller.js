const Review = require("../database/models/review-model");
const Order = require("../database/models/order-model");

// Add review (for vendor or user, tied to order)
const addReview = async (req, res, next) => {
  try {
    const { userId, vendorId, rating, comment, images, orderId } = req.body;
    const reviewerId = req.user?._id || userId;
    if (!reviewerId || !vendorId || !rating || !orderId)
      return res.status(400).json({ message: "Missing required fields." });
    // Check order exists, is completed, and belongs to user
    const order = await Order.findOne({
      _id: orderId,
      buyer: reviewerId,
      status: "Delivered",
      isDeleted: { $ne: true },
      isReviewed: { $ne: true },
    });
    if (!order)
      return res
        .status(400)
        .json({
          message:
            "Order not found, not completed, already reviewed, or not owned by user.",
        });
    const review = await Review.create({
      userId: reviewerId,
      vendorId,
      rating,
      comment,
      images,
      isVerifiedPurchase: true,
    });
    order.isReviewed = true;
    await order.save();
    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// List reviews for a vendor
const getVendorReviews = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ vendorId: id }).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

module.exports = { addReview, getVendorReviews };
