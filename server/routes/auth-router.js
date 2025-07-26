const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

// User Auth
router.get("/google-login", authController.googleLogin); // Add this new route
router.post("/google-login-user", authController.googleLoginUser);
router.post("/login", authController.login);
router.post("/register", authController.register);

// Vendor Auth
router.post("/google-login-vendor", authController.googleLoginVendor);
router.post("/vendor/login", authController.loginVendor);
router.post("/vendor/register", authController.registerVendor);


router.get("/current-user",authController.getCurrentUser)

module.exports = router;
