const express = require("express");
const orderController = require("../controllers/order-controller");
const router = express.Router();

router.post("/", orderController.placeOrder);
router.get("/user", orderController.getUserOrders);
router.get("/vendor", orderController.getVendorOrders);
router.patch("/:id/status", orderController.updateOrderStatus);
router.delete('/:id', orderController.deleteOrder);

module.exports = router; 