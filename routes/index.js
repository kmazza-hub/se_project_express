const express = require("express");
const userRouter = require("./users");  // Correct import
const clothingItemRouter = require("./clothingItems");  // Correct import
const { NOT_FOUND } = require("../utils/constants");

const router = express.Router();

// Use routes for users and clothing items
router.use("/users", userRouter);  // /api/users/signup, /api/users/signin, /api/users/me
router.use("/items", clothingItemRouter);  // /api/items

// Fallback for any unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
