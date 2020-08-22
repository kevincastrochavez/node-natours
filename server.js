const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log("Successful connection");
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log("Running on 3000");
});

process.on("unhandleRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandler Rejection");
  server.close(() => {
    process.exit(1);
  });
});
