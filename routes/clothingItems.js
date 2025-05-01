const express = require('express');
const {
  getItems,
  addItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require('../controllers/clothingItems.js');
const auth = require('../middlewares/auth.js');
const {
  validateCreateItem,
  validateItemId,
} = require('../middlewares/validation.js');

const router = express.Router();

// Public route
router.get('/', getItems);

// Authenticated and validated routes
router.post('/', auth, validateItem, addItem);
router.delete('/:itemId', auth, validateItemId, deleteItem);
router.put('/:itemId/likes', auth, validateItemId, likeItem);
router.delete('/:itemId/likes', auth, validateItemId, unlikeItem);

module.exports = router;
