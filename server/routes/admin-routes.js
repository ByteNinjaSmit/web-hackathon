const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controller");


// Admin Routes
router.post("/approve", adminController.approveVendor);
router.post("/reject", adminController.rejectVendor);

// Get unverified vendors
router.get("/unverified-vendors", adminController.getUnverifiedVendors);

router.post("/register", adminController.registerAdmin);;

module.exports = router;
