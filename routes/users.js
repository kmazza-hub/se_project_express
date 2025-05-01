const express = require('express');
const {
  getCurrentUser,
  updateUser,
} = require('../controllers/users.js');
const auth = require('../middlewares/auth.js');
const { validateUpdateUser } = require('../middlewares/validation.js'); // ✅ Validation added

const router = express.Router();

// Routes
router.get('/me', auth, getCurrentUser);
router.patch('/me', auth, validateUpdateUser, updateUser);

module.exports = router;
