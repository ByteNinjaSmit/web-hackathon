const express = require("express");
const productController = require("../controllers/product-controller");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware")

router.post("/",authMiddleware, productController.addProduct);
router.get("/",authMiddleware, productController.getProducts);
router.put("/:id", authMiddleware,productController.updateProduct);
router.delete("/:id",authMiddleware, productController.deleteProduct);

module.exports = router; 