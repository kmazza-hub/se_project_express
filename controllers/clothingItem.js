const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST_CODE, INTERNAL_SERVER_CODE, NOT_FOUND_CODE, FORBIDDEN_CODE } = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "Invalid input data" });
      }
      return res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" });
    });
};

const deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res.status(FORBIDDEN_CODE).send({ message: "You are not authorized to delete this item" });
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted successfully" }));
    })
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

const addLike = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};


const removeLike = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.send(item);
    })
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem, addLike, removeLike };
