const express = require("express");
const { login, register } = require("../controllers/auth");
const auth = require("../middlewares/auth");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later",
});

router.post("/signup", register);
router.post("/login", loginRateLimiter, login);

module.exports = router;
