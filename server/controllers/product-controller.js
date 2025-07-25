const Product = require("../database/models/product-model");

// Add new product (vendor)
const addProduct = async (req, res, next) => {
  try {
    const {
      name,
      category,
      unit,
      stockQuantity,
      pricePerUnit,
      expiryDate,
      description,
      notes,
    } = req.body;
    const supplierId = req.user?._id || req.body.supplierId; // Prefer authenticated vendor
    if (!supplierId)
      return res.status(400).json({ message: "Missing supplierId (vendor)." });
    const product = await Product.create({
      name,
      category,
      unit,
      stockQuantity,
      pricePerUnit,
      expiryDate,
      description,
      notes,
      supplierId,
    });
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Get products (optionally by vendor)
const getProducts = async (req, res, next) => {
  try {
    const {
      vendorId,
      limit = 20,
      skip = 0,
      sort = "-createdAt",
      category,
      isAvailable,
      search,
    } = req.query;
    const filter = { isDeleted: { $ne: true } };
    if (vendorId) filter.supplierId = vendorId;
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (search) filter.name = { $regex: search, $options: "i" };
    const products = await Product.find(filter)
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit));
    const total = await Product.countDocuments(filter);
    res.json({ success: true, products, total });
  } catch (error) {
    next(error);
  }
};

// Update product (vendor)
const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?._id;
    const product = await Product.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (vendorId && product.supplierId.toString() !== vendorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this product" });
    }
    Object.assign(product, req.body);
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// Delete product (vendor)
const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vendorId = req.user?._id;
    const product = await Product.findOne({
      _id: id,
      isDeleted: { $ne: true },
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    if (vendorId && product.supplierId.toString() !== vendorId.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this product" });
    }
    product.isDeleted = true;
    await product.save();
    res.json({ success: true, message: "Product deleted (soft)" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addProduct, getProducts, updateProduct, deleteProduct };
