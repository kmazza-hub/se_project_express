const express = require("express");
const { login, createUser } = require("../controllers/auth");  // Changed register to createUser
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later",
});

router.post("/signup", createUser);  // Use createUser for signup
router.post("/login", loginRateLimiter, login);  // Use login for signin

module.exports = router;
