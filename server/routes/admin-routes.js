const express = require("express");
const adminController = require("../controllers/admin-controller");

const router = express.Router();

// Admin Routes
router.post("/approve", adminController.approveVendor);
router.post("/reject", adminController.rejectVendor);

// Get unverified vendors
router.get("/unverified-vendors", adminController.getUnverifiedVendors);

module.exports = router;
