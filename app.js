const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/index");
const { PORT, MONGO_URL } = require("./utils/config");
const { NOT_FOUND_CODE } = require("./utils/errors");

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.use("/", routes);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Resource not found" });
});

app.use((err, req, res) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).send({ message });
});

app.listen(PORT);
