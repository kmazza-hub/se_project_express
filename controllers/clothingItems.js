const clothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT,
  FORBIDDEN,
} = require("../utils/constants");

const createItem = (req, res) => {
  const { name, imageUrl, weather } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.send({ item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid input data" });
      }
      return res.status(BAD_REQUEST).send({ message: err.message });
    });
};

const getItem = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.send({ items }))
    .catch((err) => {
      console.error(err);
      return res.status(DEFAULT).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  clothingItem
    .findById(itemId)
    .orFail(new Error("Clothing item not found"))
    .then((item) => {
      if (item.owner.toString() !== userId.toString()) {
        return res
          .status(FORBIDDEN)
          .send({ message: "Forbidden: You are not the owner of this item" });
      }
      return clothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.send({ message: "Item deleted successfully", deletedItem });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item ID not found" });
      }
      if (err.message === "Clothing item not found") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .orFail(new Error("Clothing item not found"))
    .then((likedItem) => {
      res.send({ message: "Item liked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item ID not found" });
      }
      if (err.message === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item not found" });
      }
      if (err.message === "Clothing item not found") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};

const unlikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true, runValidators: true }
    )
    .orFail(new Error("Clothing item not found"))
    .then((likedItem) => {
      res.send({ message: "Item unliked successfully", likedItem });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item ID not found" });
      }
      if (err.message === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Clothing item not found" });
      }
      if (err.message === "Clothing item not found") {
        return res
          .status(NOT_FOUND)
          .send({ message: "Clothing item not found" });
      }
      return res.status(DEFAULT).send({ message: err.message });
    });
};

module.exports = { createItem, getItem, deleteItem, likeItem, unlikeItem };