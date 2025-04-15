// controllers/clothingItems.js
const ClothingItem = require("../models/clothingItem");
const {
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
  CONFLICT,
} = require("../utils/errors");

const getItems = async (req, res) => {
  try {
    const items = await ClothingItem.find();
    console.log("[GET /items] Retrieved items:", items);
    res.status(200).json(items);
  } catch (error) {
    console.error("[GET /items] Error retrieving items:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to retrieve items" });
  }
};

const addItem = async (req, res) => {
  const { name, description, imageUrl, weather } = req.body;
  console.log("[POST /items] Request body:", req.body);

  try {
    const newItem = new ClothingItem({
      name,
      description,
      imageUrl,
      weather,
      owner: req.user._id,
    });
    await newItem.save();
    console.log("[POST /items] Item added:", newItem);
    res.status(201).json(newItem);
  } catch (error) {
    console.error("[POST /items] Error adding item:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to add item" });
  }
};

const deleteItem = async (req, res) => {
  console.log("[DELETE /items/:id] Attempting to delete item with ID:", req.params.id);
  try {
    // First, find the item
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      console.warn("[DELETE /items/:id] Item not found.");
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    // Check ownership before deletion
    if (item.owner.toString() !== req.user._id.toString()) {
      console.warn("[DELETE /items/:id] Unauthorized delete attempt by user:", req.user._id);
      return res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    // Now delete the item
    await ClothingItem.findByIdAndDelete(req.params.id);
    console.log("[DELETE /items/:id] Item deleted successfully:", item);
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("[DELETE /items/:id] Error deleting item:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to delete item" });
  }
};

const likeItem = async (req, res) => {
  console.log("[PUT /items/:id/likes] Like request for item ID:", req.params.id);
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      console.warn("[PUT /items/:id/likes] Item not found.");
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    if (item.likes.includes(req.user._id)) {
      console.log("[PUT /items/:id/likes] Item already liked by user:", req.user._id);
      return res.status(CONFLICT).json({ message: "Item already liked" });
    }

    item.likes.push(req.user._id);
    await item.save();
    console.log("[PUT /items/:id/likes] Item liked successfully:", item);
    res.status(200).json(item);
  } catch (error) {
    console.error("[PUT /items/:id/likes] Error liking item:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to like item" });
  }
};

const unlikeItem = async (req, res) => {
  console.log("[DELETE /items/:id/likes] Unlike request for item ID:", req.params.id);
  try {
    const item = await ClothingItem.findById(req.params.id);
    if (!item) {
      console.warn("[DELETE /items/:id/likes] Item not found.");
      return res.status(NOT_FOUND).json({ message: "Item not found" });
    }

    item.likes = item.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await item.save();
    console.log("[DELETE /items/:id/likes] Item unliked successfully:", item);
    res.status(200).json(item);
  } catch (error) {
    console.error("[DELETE /items/:id/likes] Error unliking item:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to unlike item" });
  }
};

module.exports = {
  getItems,
  addItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
