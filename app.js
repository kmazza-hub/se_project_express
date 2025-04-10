const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const mainRouter = require("./routes"); // Import the main router that includes all other routes

const app = express();

app.use(cors());
app.use(express.json());

// Mount the mainRouter at the "/api" path to add the "/api" prefix
app.use("/api", mainRouter); // All routes in mainRouter will now be prefixed with /api

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
