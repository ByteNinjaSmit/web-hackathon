const express = require("express");
const orderController = require("../controllers/order-controller");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

router.post("/", orderController.placeOrder);
router.get("/user", authMiddleware, orderController.getUserOrders);
router.get("/vendor",authMiddleware, orderController.getVendorOrders);
router.patch("/:id/status", orderController.updateOrderStatus);
router.delete("/:id", orderController.deleteOrder);

module.exports = router;
