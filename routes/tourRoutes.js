const express = require("express");
const tourController = require("../controllers/tourController");
const authenticationController = require("../controllers/authenticationController");
// const reviewController = require("../controllers/reviewController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

// router.param("id", tourController.checkID);

// router
//   .route("/:tourId/reviews")
//   .post(
//     authenticationController.protect,
//     authenticationController.restrictTo("user"),
//     reviewController.createReview
//   );

router.use("/:tourId/reviews", reviewRouter);

router
  .route("/top-5-cheap")
  .get(tourController.aliasTopTours, tourController.getAllTours); // Route for top 5 tours

router.route("/tour-stats").get(tourController.getTourStats);
router
  .route("/monthly-plan/:year")
  .get(
    authenticationController.protect,
    authenticationController.restrictTo("admin", "lead-guide", "guide"),
    tourController.getMonthlyPlan
  );

router
  .route("/tours-within/:distance/center/:latlng/unit/:unit")
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route("/distances/:latlng/unit/:unit").get(tourController.getDistances);

router
  .route("/")
  .get(tourController.getAllTours)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo("admin", "lead-guide"),
    tourController.createTour
  );

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(
    authenticationController.protect,
    authenticationController.restrictTo("admin", "lead-guide"),
    tourController.updateTour
  )
  .delete(
    authenticationController.protect,
    authenticationController.restrictTo("admin", "lead-guide"),
    tourController.deleteTour
  );

module.exports = router;
