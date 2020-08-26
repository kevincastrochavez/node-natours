/* eslint-disable prettier/prettier */
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const reviewRouter = require("./routes/reviewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
////////////////////////////////
// GLOBAL MIDDLEWARES
// SERVING STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

// SET SECURITY HTTP HEADERS
app.use(helmet());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// LIMIT REQUESTS FOR SAME API BY IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP. Please try again in an hour",
});
app.use("/api", limiter);

// BODY PARSER
app.use(express.json({ limit: "10kb" }));

// DATA SANITIZATION AGAINST NOSQL QUERY INJECTION
app.use(mongoSanitize());

// DATA SANITIZATION AGAINST XSS
app.use(xss());

// PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

// app.use((req, res, next) => {
//   // console.log("Hello, next");
//   next();
// });

// TEST MIDDLEWARE
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

////////////////////////
// ROUTES
app.get("/", (req, res, next) => {
  res.status(200).render("base", {
    tour: "The Forest Hiker",
    user: "Kevin",
  });
});

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

// Unhandled routes
app.all("*", (req, res, next) => {
  // const err = new Error("Can not fin in server");
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError("Can not fin in server", 404));
});

app.use(globalErrorHandler);

module.exports = app;
