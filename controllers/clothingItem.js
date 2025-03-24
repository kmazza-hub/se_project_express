const ClothingItem = require("../models/clothingItem");
const {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_CODE,
  NOT_FOUND_CODE,
  FORBIDDEN_CODE,
} = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() =>
      res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" })
    );
};

const getUserClothingItems = (req, res) => {
  ClothingItem.find({ owner: req.user._id })
    .then((items) => res.send(items))
    .catch(() =>
      res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" })
    );
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid input data" });
      }
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "Internal server error" });
    });
};

const deleteClothingItem = (req, res) => {
  ClothingItem.findById(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      if (item.owner.toString() !== req.user._id) {
        return res.status(FORBIDDEN_CODE).send({ message: "Forbidden" });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted" }))
        .catch(() =>
          res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" })
        );
    })
    .catch(() =>
      res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" })
    );
};

module.exports = {
  getClothingItems,
  createClothingItem,
  getUserClothingItems,
  deleteClothingItem,
};
