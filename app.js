require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const auth = require("./middlewares/auth");
const { NOT_FOUND_CODE } = require("./utils/errors");

const { PORT = 3001, MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db" } = process.env;

const app = express();

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("✅ Successfully connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use(auth);

app.use("/", mainRouter);

app.use((req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Resource not found" });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500 ? "Internal Server Error" : message,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
