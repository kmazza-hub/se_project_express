const clothingItemSchema = require("../models/clothingItem");
const {
  INTERNAL_SERVER_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log("User:", req.user);
  console.log("Body:", req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItemSchema
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log("Created Item:", item);
      res.status(201).json({ data: item });
    })
    .catch((err) => {
      console.error("Error creating item:", err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).json({ message: "Invalid input data" });
      }
      return res.status(INTERNAL_SERVER_CODE).json({ message: "Internal server error" });
    });
};

const getItems = (req, res) => {
  clothingItemSchema
    .find({})
    .then((items) => res.status(200).json(items))
    .catch((err) => {
      console.error("Error fetching items:", err);
      res.status(INTERNAL_SERVER_CODE).json({ message: "Internal server error" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log("Deleting Item ID:", itemId);
  clothingItemSchema
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).json({ data: item }))
    .catch((err) => {
      console.error("Error deleting item:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_CODE).json({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_CODE).json({ message: "Internal server error" });
    });
};

const likeItem = (req, res) => {
  clothingItemSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).json({ data: item }))
    .catch((err) => {
      console.error("Error liking item:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_CODE).json({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_CODE).json({ message: "Internal server error" });
    });
};

const dislikeItem = (req, res) => {
  clothingItemSchema
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.status(200).json({ data: item }))
    .catch((err) => {
      console.error("Error disliking item:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).json({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST_CODE).json({ message: "Invalid item ID format" });
      }
      return res.status(INTERNAL_SERVER_CODE).json({ message: "Internal server error" });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
