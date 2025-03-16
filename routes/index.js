const router = require("express").Router();
const clothingItemRouter = require("./clothingItem");
const userRouter = require("./users");
const { NOT_FOUND_CODE } = require("../utils/errors");

router.use("/items", clothingItemRouter);

router.use("/users", userRouter);

router.use("*", (req, res) => {
  res.status(NOT_FOUND_CODE).send({ message: "Router not found" });
});

module.exports = router;
