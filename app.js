const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello from the server", app: "Hola" });
});

app.post("/", (req, res) => {
  res.send("You can post");
});

const port = 3000;
app.listen(port, () => {
  console.log("Running on 3000");
});
