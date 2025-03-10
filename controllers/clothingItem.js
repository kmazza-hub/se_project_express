const clothingItemSchema = require("../models/clothingItem");
const {
  INTERNAL_SERVER_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require("../utils/errors");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  clothingItemSchema
    .create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "A bad request has occurred on the server", err });
      }
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server", err });
    });
};

const getItems = (req, res) => {
  clothingItemSchema
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server", err });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  clothingItemSchema
    .findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "item not found", err });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "A bad request has occurred on the server", err });
      }
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server", err });
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
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "item not found", err });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "A bad request has occurred on the server", err });
      }
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server", err });
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
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_CODE)
          .send({ message: "item not found", err });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "A bad request has occurred on the server", err });
      }
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server", err });
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};