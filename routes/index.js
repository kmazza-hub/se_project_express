const express = require("express");
const userRouter = require("./users"); // User routes
const clothingItemRouter = require("./clothingItems"); // Clothing item routes
const { NOT_FOUND } = require("../utils/constants"); // Constant for status code

const router = express.Router();

// Use the imported routers with respective path prefixes
router.use("/users", userRouter);  // Handle /api/users routes
router.use("/items", clothingItemRouter);  // Handle /api/items routes

// Fallback for any unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;

