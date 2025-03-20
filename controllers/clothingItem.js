const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST_CODE, INTERNAL_SERVER_CODE, NOT_FOUND_CODE } = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "Invalid input data" });
      }
      return res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" });
    });
};

const deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndRemove(req.params.id)
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND_CODE).send({ message: "Item not found" });
      }
      return res.send({ message: "Item deleted successfully" });
    })
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
