const express = require("express");
const reviewController = require("../controllers/review-controller");
const router = express.Router();

router.post("/", reviewController.addReview);
router.get("/vendor/:id", reviewController.getVendorReviews);

module.exports = router; 