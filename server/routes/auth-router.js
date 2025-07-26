const express = require("express");
const authController = require("../controllers/auth-controller");

const router = express.Router();

// User Auth
router.post("/google-login-user", authController.googleLoginUser);
router.post("/login", authController.login);
router.post("/register", authController.register);

// Vendor Auth
router.post("/google-login-vendor", authController.googleLoginVendor);
router.post("/vendor/login", authController.loginVendor);
router.post("/vendor/register", authController.registerVendor);

//admin auth
router.post("/admin/login", authController.loginAdmin);

module.exports = router;
