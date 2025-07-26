const express = require("express");
const productController = require("../controllers/product-controller");
const router = express.Router();

router.post("/", productController.addProduct);
router.get("/", productController.getProducts);
router.put("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

// Add new route for getting products by vendor ID
router.get("/vendor/:vendorId", productController.getProductsByVendor);

module.exports = router;