const ClothingItem = require('../models/clothingItem.js');
const BadRequestError = require('../errors/BadRequestError.js');
const NotFoundError = require('../errors/NotFoundError.js');
const ForbiddenError = require('../errors/ForbiddenError.js');
const ConflictError = require('../errors/ConflictError.js');

// Get all items
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    return res.status(200).json(items);
  } catch (err) {
    return next(err);
  }
};

// Add new item
const addItem = async (req, res, next) => {
  const { name, description, imageUrl, weather } = req.body;

  try {
    const newItem = await ClothingItem.create({
      name,
      description,
      imageUrl,
      weather,
      owner: req.user._id,
    });

    return res.status(201).json(newItem);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return next(new BadRequestError('Invalid item data'));
    }
    return next(err);
  }
};

// Delete item
const deleteItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    if (!item) {
      return next(new NotFoundError('Item not found'));
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(new ForbiddenError('You can only delete your own items'));
    }

    await item.deleteOne();
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    return next(err);
  }
};

// Like item
const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    if (!item) {
      return next(new NotFoundError('Item not found'));
    }

    if (item.likes.includes(req.user._id)) {
      return next(new ConflictError('Item already liked'));
    }

    item.likes.push(req.user._id);
    await item.save();

    return res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
};

// Unlike item
const unlikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.itemId);

    if (!item) {
      return next(new NotFoundError('Item not found'));
    }

    item.likes = item.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await item.save();

    return res.status(200).json(item);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getItems,
  addItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
