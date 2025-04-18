require("dotenv").config();
console.log("JWT Secret Loaded:", process.env.JWT_SECRET);
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", mainRouter);

mongoose
  .connect("mongodb://localhost:27017/wtwr", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3001, () => console.log("Server running at http://localhost:3001"));
  })
  .catch((err) => console.error("MongoDB connection error:", err));