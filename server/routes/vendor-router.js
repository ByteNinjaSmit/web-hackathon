const express = require("express");
const vendorController = require("../controllers/vendor-controller");
const adminController = require("../controllers/admin-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// Get nearby vendors based on coordinates
router.get("/nearby", vendorController.getNearbyVendors);

// Get vendors with products by location
router.get("/with-products", vendorController.getVendorsWithProducts);

// Get all vendors (for admin purposes)
router.get("/", vendorController.getAllVendors);
router.get("/unverified-vendors", adminController.getUnverifiedVendors);

// Get product statistics for a vendor (requires authentication)
router.get("/product-stats", authMiddleware, vendorController.getProductStats);


// GEt OWN Products
router.get("/own-products", authMiddleware, vendorController.getOwnProducts);
module.exports = router;