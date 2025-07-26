const express = require("express");
const vendorController = require("../controllers/vendor-controller");
const router = express.Router();

// Get nearby vendors based on coordinates
router.get("/nearby", vendorController.getNearbyVendors);

// Get vendors with products by location
router.get("/with-products", vendorController.getVendorsWithProducts);

// Get all vendors (for admin purposes)
router.get("/", vendorController.getAllVendors);

module.exports = router; 