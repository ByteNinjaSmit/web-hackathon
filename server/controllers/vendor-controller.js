const Vendor = require("../database/models/vendor-model");
const Product = require("../database/models/product-model");

// Get nearby vendors based on user coordinates
const getNearbyVendors = async (req, res, next) => {
  try {
    const { 
      latitude, 
      longitude, 
      maxDistance = 10000, // Default 10km in meters
      limit = 20,
      skip = 0,
      includeProducts = false 
    } = req.query;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: "Latitude and longitude are required" 
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const distance = parseFloat(maxDistance);

    if (isNaN(lat) || isNaN(lng) || isNaN(distance)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid coordinates or distance" 
      });
    }

    // Find vendors within the specified distance
    const nearbyVendors = await Vendor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat] // MongoDB expects [longitude, latitude]
          },
          $maxDistance: distance
        }
      },
      isGoogleAccount: { $ne: true } // Exclude incomplete profiles
    })
    .select('-password') // Exclude password
    .limit(parseInt(limit))
    .skip(parseInt(skip))
    .lean();

    // If products are requested, fetch them for each vendor
    if (includeProducts === 'true') {
      const vendorIds = nearbyVendors.map(vendor => vendor._id);
      const products = await Product.find({
        supplierId: { $in: vendorIds },
        isDeleted: { $ne: true },
        isAvailable: true
      }).lean();

      // Group products by vendor
      const productsByVendor = products.reduce((acc, product) => {
        const vendorId = product.supplierId.toString();
        if (!acc[vendorId]) {
          acc[vendorId] = [];
        }
        acc[vendorId].push(product);
        return acc;
      }, {});

      // Add products to vendors
      nearbyVendors.forEach(vendor => {
        vendor.products = productsByVendor[vendor._id.toString()] || [];
        vendor.productCount = vendor.products.length;
      });
    }

    // Calculate distance for each vendor
    nearbyVendors.forEach(vendor => {
      if (vendor.location && vendor.location.coordinates) {
        const vendorLng = vendor.location.coordinates[0];
        const vendorLat = vendor.location.coordinates[1];
        vendor.distance = calculateDistance(lat, lng, vendorLat, vendorLng);
      }
    });

    // Sort by distance
    nearbyVendors.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

    res.json({
      success: true,
      vendors: nearbyVendors,
      total: nearbyVendors.length,
      searchLocation: { latitude: lat, longitude: lng },
      maxDistance: distance
    });

  } catch (error) {
    next(error);
  }
};

// Get vendors with products by location
const getVendorsWithProducts = async (req, res, next) => {
  try {
    const { 
      latitude, 
      longitude, 
      maxDistance = 10000,
      category,
      search,
      limit = 20,
      skip = 0 
    } = req.query;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        message: "Latitude and longitude are required" 
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);
    const distance = parseFloat(maxDistance);

    if (isNaN(lat) || isNaN(lng) || isNaN(distance)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid coordinates or distance" 
      });
    }

    // Build product filter
    const productFilter = {
      isDeleted: { $ne: true },
      isAvailable: true
    };

    if (category) {
      productFilter.category = category;
    }

    if (search) {
      productFilter.name = { $regex: search, $options: "i" };
    }

    // Find vendors within distance
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
    })
    .select('-password')
    .lean();

    const vendorIds = nearbyVendors.map(vendor => vendor._id);

    // Find products for these vendors
    const products = await Product.find({
      ...productFilter,
      supplierId: { $in: vendorIds }
    })
    .populate('supplierId', 'name businessName location address')
    .lean();

    // Group products by vendor
    const vendorsWithProducts = nearbyVendors.map(vendor => {
      const vendorProducts = products.filter(
        product => product.supplierId._id.toString() === vendor._id.toString()
      );
      
      return {
        ...vendor,
        products: vendorProducts,
        productCount: vendorProducts.length,
        distance: vendor.location && vendor.location.coordinates ? 
          calculateDistance(lat, lng, vendor.location.coordinates[1], vendor.location.coordinates[0]) : null
      };
    }).filter(vendor => vendor.productCount > 0); // Only return vendors with products

    // Sort by distance
    vendorsWithProducts.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));

    res.json({
      success: true,
      vendors: vendorsWithProducts.slice(skip, skip + parseInt(limit)),
      total: vendorsWithProducts.length,
      searchLocation: { latitude: lat, longitude: lng },
      maxDistance: distance
    });

  } catch (error) {
    next(error);
  }
};

// Get all vendors (for admin purposes)
const getAllVendors = async (req, res, next) => {
  try {
    const { limit = 20, skip = 0, search, verified } = req.query;
    
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { businessName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }

    if (verified !== undefined) {
      filter.isGoogleAccount = verified === 'true';
    }

    const vendors = await Vendor.find(filter)
      .select('-password')
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort('-createdAt')
      .lean();

    const total = await Vendor.countDocuments(filter);

    res.json({
      success: true,
      vendors,
      total
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

module.exports = {
  getNearbyVendors,
  getVendorsWithProducts,
  getAllVendors
}; 