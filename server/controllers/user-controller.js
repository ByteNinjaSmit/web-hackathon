const Order = require("../database/models/order-model");
const mongoose = require("mongoose");

// Get orders for the currently logged-in user
const getUserOrders = async (req, res, next) => {
  try {
    // Get user ID from authenticated request
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Query parameters for pagination and filtering
    const { limit = 20, skip = 0, sort = "-createdAt", status } = req.query;
    
    // Build filter object
    const filter = { buyer: userId, isDeleted: { $ne: true } };
    if (status) filter.status = status;

    // Find orders and populate product details
    const orders = await Order.find(filter)
      .populate({
        path: "products.product",
        select: "name pricePerUnit unit"
      })
      .populate({
        path: "vendorId",
        select: "name businessName"
      })
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit));

    // Count total orders matching the filter
    const total = await Order.countDocuments(filter);

    res.json({ success: true, orders, total });
  } catch (error) {
    next(error);
  }
};

// Get a specific order by ID for the current user
const getUserOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Find the specific order for this user
    const order = await Order.findOne({
      _id: orderId,
      buyer: userId,
      isDeleted: { $ne: true }
    })
      .populate({
        path: "products.product",
        select: "name pricePerUnit unit"
      })
      .populate({
        path: "vendorId",
        select: "name businessName"
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserOrders,
  getUserOrderById
};