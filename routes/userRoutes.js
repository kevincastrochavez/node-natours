const express = require("express");

const userController = require("../controllers/userController");
const authenticationController = require("../controllers/authenticationController");

const router = express.Router();

router.post("/signup", authenticationController.signup);
router.post("/login", authenticationController.login);
router.post("/forgotPassword", authenticationController.forgotPassword);
router.patch("/resetPassword/:token", authenticationController.resetPassword);

// PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authenticationController.protect);

router.patch("/updateMyPassword", authenticationController.updatePassword);
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMe", userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// ONLY ADMINS ACCESS TO THIS ROUTES
router.use(authenticationController.restrictTo("admin"));

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
