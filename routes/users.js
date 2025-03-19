const express = require("express");
const auth = require("../middlewares/auth");
const { getCurrentUser, updateCurrentUser } = require("../controllers/users"); // ✅ Ensure correct import

const router = express.Router();

router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateCurrentUser);

module.exports = router;
