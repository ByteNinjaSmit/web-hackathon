const express = require("express");
const userController = require("../controllers/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

// Routes that require authentication
router.get("/orders", authMiddleware, userController.getUserOrders);
router.get("/orders/:orderId", authMiddleware, userController.getUserOrderById);

module.exports = router;