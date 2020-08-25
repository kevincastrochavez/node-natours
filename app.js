/* eslint-disable prettier/prettier */
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

////////////////////////////////
// GLOBAL MIDDLEWARES
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

// SERVING STATIC FILES
app.use(express.static(`${__dirname}/public`));

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
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// Unhandled routes
app.all("*", (req, res, next) => {
  // const err = new Error("Can not fin in server");
  // err.status = "fail";
  // err.statusCode = 404;

  next(new AppError("Can not fin in server", 404));
});

app.use(globalErrorHandler);

module.exports = app;
