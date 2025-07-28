const express = require("express");
const authController = require("../controllers/auth-controller");
const authMiddleware = require("../middlewares/auth-middleware");

const router = express.Router();

// User Auth
router.get("/google-login", authController.googleLogin); // Add this new route
router.post("/google-login-user", authController.googleLoginUser);
router.post("/login", authController.login);
router.post("/register", authController.register);

// Vendor Auth
router.get("/vendor-google", authController.vendorGoogleLogin);    // Using Token Code
router.post("/google-login-vendor", authController.googleLoginVendor);
router.post("/vendor/login", authController.loginVendor);
router.post("/vendor/register", authController.registerVendor);

router.post("/admin/login", authController.loginAdmin);
router.get("/current-user",authMiddleware,authController.getCurrentUser)

// User Profile Update (requires authentication)
router.put("/user/update-profile", authMiddleware, authController.updateUserProfile);
// Update Vendor Profile
router.put("/vendor/complete-profile", authMiddleware, authController.updateVendorProfile);

module.exports = router;
