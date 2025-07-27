const Vendor = require("../database/models/vendor-model");
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


const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = value => (value * Math.PI) / 180;
  const R = 6371000; // meters

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

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
      latitude,
      longitude,
      maxDistance = 100000,
    } = req.query;

    const filter = { isDeleted: { $ne: true } };

    if (vendorId) filter.supplierId = vendorId;
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (search) filter.name = { $regex: search, $options: "i" };

    let products = [];
    let total = 0;

    const useGeo = latitude && longitude;

    if (useGeo) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const distance = parseFloat(maxDistance);

      if (isNaN(lat) || isNaN(lng) || isNaN(distance)) {
        return res.status(400).json({
          success: false,
          message: "Invalid latitude, longitude, or maxDistance",
        });
      }

      // Step 1: Fetch all vendors with valid location
      const allVendors = await Vendor.find({
        "location.lat": { $ne: null },
        "location.lng": { $ne: null },
        // isVerified: true,
        // isRejected: false,
      }).select("_id location name businessName address").lean();

      // Step 2: Manually calculate distance
      const nearbyVendors = allVendors
        .map((v) => {
          const dist = calculateDistance(lat, lng, v.location.lat, v.location.lng);
          return { ...v, distance: dist };
        })
        .filter((v) => v.distance <= distance);

      const vendorIds = nearbyVendors.map(v => v._id);

      if (vendorIds.length === 0) {
        return res.json({
          success: true,
          products: [],
          total: 0,
          searchLocation: { latitude: lat, longitude: lng },
        });
      }

      filter.supplierId = { $in: vendorIds };

      // Step 3: Get Products
      products = await Product.find(filter)
        .populate("supplierId", "name businessName location address")
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit))
        .lean();

      total = await Product.countDocuments(filter);

      // Step 4: Add distance to each product
      products.forEach(product => {
        const vendor = nearbyVendors.find(v => v._id.toString() === product.supplierId?._id?.toString());
        if (vendor) {
          product.distance = vendor.distance;
        }
      });

      // Optional: Sort products by distance
      products.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else {
      // No geo filter — just fetch normally
      products = await Product.find(filter)
        .populate("supplierId", "name businessName location address")
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit))
        .lean();

      total = await Product.countDocuments(filter);
    }

    return res.json({
      success: true,
      products,
      total,
      searchLocation: useGeo ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) } : null,
    });
  } catch (error) {
    console.error("getProducts error:", error);
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



// Get products by vendor ID
const getProductsByVendor = async (req, res, next) => {
  try {
    const { vendorId } = req.params;
    const { 
      limit = 20, 
      page = 1,
      sort = "-createdAt",
      category,
      search 
    } = req.query;
    
    // Calculate skip value for pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build filter object
    const filter = { 
      supplierId: vendorId,
      isDeleted: { $ne: true } 
    };
    
    // Add optional filters
    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    
    // Execute query with pagination
    const products = await Product.find(filter)
      .populate('supplierId', 'name businessName location address email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    // Return response
    res.json({ 
      success: true, 
      products,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  addProduct, 
  getProducts, 
  updateProduct, 
  deleteProduct,
  getProductsByVendor  // Add the new function to exports
};
