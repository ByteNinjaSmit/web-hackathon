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
      latitude,
      longitude,
      maxDistance = 10000,
    } = req.query;
    
    const filter = { isDeleted: { $ne: true } };
    if (vendorId) filter.supplierId = vendorId;
    if (category) filter.category = category;
    if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";
    if (search) filter.name = { $regex: search, $options: "i" };

    let products;
    let total;

    // If location is provided, filter by nearby vendors
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const distance = parseFloat(maxDistance);

      if (isNaN(lat) || isNaN(lng) || isNaN(distance)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid coordinates or distance" 
        });
      }

      // First find nearby vendors
      const Vendor = require("../database/models/vendor-model");
      const nearbyVendors = await Vendor.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [lng, lat]
            },
            $maxDistance: distance
          }
        },
        isGoogleAccount: { $ne: true }
      }).select('_id').lean();

      const vendorIds = nearbyVendors.map(vendor => vendor._id);
      
      // Then find products from these vendors
      filter.supplierId = { $in: vendorIds };
      
      products = await Product.find(filter)
        .populate('supplierId', 'name businessName location address')
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit))
        .lean();

      total = await Product.countDocuments(filter);

      // Calculate distance for each product
      products.forEach(product => {
        if (product.supplierId && product.supplierId.location && product.supplierId.location.coordinates) {
          const vendorLng = product.supplierId.location.coordinates[0];
          const vendorLat = product.supplierId.location.coordinates[1];
          product.distance = calculateDistance(lat, lng, vendorLat, vendorLng);
        }
      });

      // Sort by distance if location-based search
      products.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
    } else {
      // Regular product search without location
      products = await Product.find(filter)
        .populate('supplierId', 'name businessName location address')
        .sort(sort)
        .skip(Number(skip))
        .limit(Number(limit))
        .lean();
      
      total = await Product.countDocuments(filter);
    }

    res.json({ 
      success: true, 
      products, 
      total,
      searchLocation: latitude && longitude ? { latitude: parseFloat(latitude), longitude: parseFloat(longitude) } : null
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to calculate distance between two points (Haversine formula)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 1000); // Return in meters
}

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
