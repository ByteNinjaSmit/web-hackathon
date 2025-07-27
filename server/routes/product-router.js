const express = require("express");
const productController = require("../controllers/product-controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")

router.post("/",authMiddleware, productController.addProduct);
router.get("/",productController.getProducts);
router.put("/:id", authMiddleware,productController.updateProduct);
router.delete("/:id",authMiddleware, productController.deleteProduct);

// Add new route for getting products by vendor ID
router.get("/vendor/:vendorId", productController.getProductsByVendor);

module.exports = router;