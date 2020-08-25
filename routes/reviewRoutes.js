const reviewController = require("../controllers/reviewController");
const express = require("express");
const authenticationController = require("../controllers/authenticationController");

const router = express.Router();

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo("user"),
    reviewController.createReview
  );

module.exports = router;
