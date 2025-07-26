const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin-controller");


// Admin Routes
router.post("/approve", adminController.approveVendor);
router.post("/reject", adminController.rejectVendor);

// Get unverified vendors
router.get("/unverified-vendors", adminController.getUnverifiedVendors);
router.get("/verified-vendors", adminController.getverifiedVendors);
router.get("/rejected-vendors", adminController.getRejectedVendors);

router.post("/register", adminController.registerAdmin);;
router.post("/remove-supplier", adminController.removeVendor);;

module.exports = router;
