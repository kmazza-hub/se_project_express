const User = require("../models/user");
const {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_CODE,
  NOT_FOUND_CODE,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error("Error fetching users:", err);
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  console.log("Creating user:", name, avatar);

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error("Error creating user:", err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid input data" });
      }
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error("Error fetching user:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid user ID format" });
      }
      return res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser };
