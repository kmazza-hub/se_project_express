const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BAD_REQUEST_CODE, INTERNAL_SERVER_CODE, UNAUTHORIZED_CODE, CONFLICT_CODE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      return res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT_CODE).send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "Invalid input data" });
      }
      return res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED_CODE).send({ message: "Incorrect email or password" });
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return res.status(UNAUTHORIZED_CODE).send({ message: "Incorrect email or password" });
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
        return res.send({ token });
      });
    })
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res.status(UNAUTHORIZED_CODE).send({ message: "User not found" });
      }
      res.send(user);
    })
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

const updateCurrentUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send(user))
    .catch(() => res.status(INTERNAL_SERVER_CODE).send({ message: "Internal server error" }));
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};

