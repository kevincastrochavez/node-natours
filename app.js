const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

////////////////////////////////
// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());

app.use((req, res, next) => {
  console.log("Hello, next");
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.get("/", (req, res) => {
//   res.status(200).json({ message: "Hello from the server", app: "Hola" });
// });

// app.post("/", (req, res) => {
//   res.send("You can post");
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

/////////////////////////
// ROUTE HANDLERS
const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: "success",
    time: req.requestTime,
    results: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  console.log(req.params);

  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour,
    },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      tour: "Updated tour",
    },
  });
};

const deleteTour = (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUsers = (rew, res) => {
  res.status(500).json({
    status: "err",
    message: "Route not yet defined",
  });
};

const getUser = (rew, res) => {
  res.status(500).json({
    status: "err",
    message: "Route not yet defined",
  });
};
const createUser = (rew, res) => {
  res.status(500).json({
    status: "err",
    message: "Route not yet defined",
  });
};
const updateUser = (rew, res) => {
  res.status(500).json({
    status: "err",
    message: "Route not yet defined",
  });
};
const deleteUser = (rew, res) => {
  res.status(500).json({
    status: "err",
    message: "Route not yet defined",
  });
};

////////////////////////////////////
// GET TOURS

// app.get("/api/v1/tours", getAllTours);

////////////////////////////////////
// GET TOUR

// app.get("/api/v1/tours/:id", getTour);

////////////////////////////////////
// POST

// app.post("/api/v1/tours", createTour);

////////////////////////////////////
// PATCH

// app.patch("/api/v1/tours/:id", updateTour);

////////////////////////////////////
// DELETE
// app.delete("/api/v1/tours/:id", deleteTour);

////////////////////////
// ROUTES

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route("/").get(getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/user", userRouter);

/////////////////////////
// SERVER
const port = 3000;
app.listen(port, () => {
  console.log("Running on 3000");
});
