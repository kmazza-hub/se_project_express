const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const clothingItemsRouter = require("./routes/clothingItems");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", clothingItemsRouter);

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
