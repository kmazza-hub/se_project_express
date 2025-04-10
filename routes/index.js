// routes/index.js
const router = require("express").Router();
const { loginUser, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/constants");
const clothingItemRouter = require("./clothingItems");
const userRouter = require("./users");

// Auth routes
router.post("/signin", loginUser);
router.post("/signup", createUser);

// Mount routers
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

// Catch-all for unknown routes
router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Requested resource not found" });
});

module.exports = router;