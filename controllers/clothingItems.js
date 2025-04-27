const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");

// Get all items
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find();
    res.status(200).json(items);
  } catch (err) {
    next(err);
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

    res.status(201).json(newItem);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Invalid item data"));
    } else {
      next(err);
    }
  }
};

// Delete item
const deleteItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    if (item.owner.toString() !== req.user._id.toString()) {
      return next(new UnauthorizedError("You can only delete your own items"));
    }

    await item.deleteOne();

    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// Like item
const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    if (item.likes.includes(req.user._id)) {
      return next(new ConflictError("Item already liked"));
    }

    item.likes.push(req.user._id);
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

// Unlike item
const unlikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findById(req.params.id);

    if (!item) {
      return next(new NotFoundError("Item not found"));
    }

    item.likes = item.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await item.save();

    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getItems,
  addItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
