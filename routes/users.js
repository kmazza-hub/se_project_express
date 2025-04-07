const express = require("express");

const router = express.Router();
const {
  /* loginUser,
  createUser, */
  getCurrentUser,
  updateUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth"); // I have "const auth = require("../middlewares/auth");" here so I must find out why its not updating

/* router.post("/login", loginUser);
router.post("/register", createUser); */
router.get("/users/me", auth, getCurrentUser);
router.patch("/users/me", auth, updateUser);

module.exports = router;

/// / I really have no idea if this is correct. I apologize if I have changed too much