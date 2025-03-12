const express = require("express");
const { createUser, login } = require("../controllers/users");

const router = express.Router();

router.post("/signup", createUser);
router.post("/signin", login);

module.exports = router;
