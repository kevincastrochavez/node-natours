const express = require("express");
const reviewController = require("../controllers/reviewController");
const authenticationController = require("../controllers/authenticationController");

const router = express.Router({ mergeParams: true });

router.use(authenticationController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.restrictTo("user"),
    reviewController.setTourUserIds,
    reviewController.createReview
  );

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authenticationController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authenticationController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

module.exports = router;
