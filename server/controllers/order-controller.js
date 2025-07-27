const Order = require("../database/models/order-model");

// Place order (user)
const placeOrder = async (req, res, next) => {
  try {
    const {
      vendorId,
      products,
      amount,
      paymentMethod,
      pickupTime,
      deliveryType,
      deliveryAddressSnapshot,
      notes,
      buyerContactSnapshot,
      pickupCoordinates,
    } = req.body;
    const buyer = req.user?._id || req.body.buyer; // Prefer authenticated user
    if (!buyer || !vendorId || !products || !amount)
      return res.status(400).json({ message: "Missing required fields." });
    const order = await Order.create({
      vendorId,
      buyer,
      products,
      amount,
      paymentMethod,
      pickupTime,
      deliveryType,
      deliveryAddressSnapshot,
      notes,
      buyerContactSnapshot,
      pickupCoordinates,
    });
    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// List user's orders
const getUserOrders = async (req, res, next) => {
  try {
    console.log("Fetching user orders");
    const userId = req.user?._id || req.userID || req.query.userId;
    // console.log("User ID:", userId);
    const { limit = 20, skip = 0, sort = "-createdAt", status } = req.query;
    if (!userId) return res.status(400).json({ message: "Missing userId." });
    const filter = { buyer: userId, isDeleted: { $ne: true } };
    if (status) filter.status = status;
    const orders = await Order.find(filter)
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit));
    const total = await Order.countDocuments(filter);
    res.json({ success: true, orders, total });
  } catch (error) {
    next(error);
  }
};

// List vendor's incoming orders
const getVendorOrders = async (req, res, next) => {
  try {
    const vendorId = req.user?._id || req.query.vendorId;
    const { limit = 20, skip = 0, sort = "-createdAt", status } = req.query;
    if (!vendorId)
      return res.status(400).json({ message: "Missing vendorId." });
    const filter = { vendorId, isDeleted: { $ne: true } };
    if (status) filter.status = status;
    const orders = await Order.find(filter)
      .populate("buyer", "-password -__v") 
      .populate("products.product")
      .populate("vendorId", "-password -__v") 
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Order.countDocuments(filter);
    res.json({ success: true, orders, total });
  } catch (error) {
    next(error);
  }
};

// Vendor updates order status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

const deleteOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?._id;
    const order = await Order.findOne({ _id: id, isDeleted: { $ne: true } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (vendorId && order.vendorId.toString() !== vendorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this order" });
    }
    order.isDeleted = true;
    await order.save();
    res.json({ success: true, message: "Order deleted (soft)" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getVendorOrders,
  updateOrderStatus,
  deleteOrder,
};
