const express = require("express");
const vendorController = require("../controllers/vendor-controller");
const adminController = require("../controllers/admin-controller");
const router = express.Router();

// Get nearby vendors based on coordinates
router.get("/nearby", vendorController.getNearbyVendors);

// Get vendors with products by location
router.get("/with-products", vendorController.getVendorsWithProducts);

// Get all vendors (for admin purposes)
router.get("/", vendorController.getAllVendors);
router.get("/unverified-vendors", adminController.getUnverifiedVendors);

module.exports = router; 