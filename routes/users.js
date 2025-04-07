const express = require("express");
const {
  loginUser,
  createUser,
  getCurrentUser,
  updateUser,
} = require("../controllers/users"); // Correct import
const auth = require("../middlewares/auth");

const router = express.Router();

// POST /api/signin (Login)
router.post("/signin", loginUser);

// POST /api/signup (Signup)
router.post("/signup", createUser);

// GET /api/users/me (Get current user)
router.get("/me", auth, getCurrentUser);

// PATCH /api/users/me (Update current user profile)
router.patch("/me", auth, updateUser);

module.exports = router;
