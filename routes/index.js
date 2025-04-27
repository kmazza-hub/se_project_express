const express = require("express");
const { validateSignin, validateSignup } = require("../middlewares/validation");
const { loginUser, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/constants");
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");
const { getWeather } = require("../controllers/weather");

const router = express.Router();

// Auth routes
router.post("/signin", validateSignin, loginUser);
router.post("/signup", validateSignup, createUser);

// Main routes
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Weather route
router.get("/weather", getWeather);

// 404 fallback
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;
