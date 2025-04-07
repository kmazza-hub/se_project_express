// app.js

const express = require("express");
const mongoose = require("mongoose");
const clothingItemsRouter = require("./routes/clothingItems");

const app = express();

app.use(express.json()); // For parsing application/json
app.use("/api", clothingItemsRouter); // Register the routes for clothing items

mongoose.connect("mongodb://localhost:27017/wtwr", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("MongoDB connected");
    app.listen(3001, () => {
      console.log("Server is running on http://localhost:3001");
    });
  })
  .catch(err => console.error("MongoDB connection error:", err));
