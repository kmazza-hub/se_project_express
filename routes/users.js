const express = require("express");
const {
  loginUser,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users"); // Correct import for user controller
const auth = require("../middlewares/auth"); // Middleware for authorization

const router = express.Router(); // Create an Express router

// Define the routes
router.post("/signin", loginUser); // User login
router.post("/signup", createUser); // User signup
router.get("/me", auth, getCurrentUser); // Get current logged-in user's profile
router.patch("/me", auth, updateUser); // Update current logged-in user's profile

module.exports = router; // Export the router instance
