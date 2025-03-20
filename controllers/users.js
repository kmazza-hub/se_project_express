const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { BAD_REQUEST_CODE, UNAUTHORIZED_CODE, CONFLICT_CODE } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      res.status(201).send(userData);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(CONFLICT_CODE).send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "Invalid input data" });
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findOne({ email }).select("+password")
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
    .catch(next);
};

const getCurrentUser = (req, res, next) =>
  User.findById(req.user._id)
    .then((user) => {
      if (user) return res.send(user);
      return res.status(UNAUTHORIZED_CODE).send({ message: "User not found" });
    })
    .catch(next);

const updateCurrentUser = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (user) return res.send(user);
      return res.status(UNAUTHORIZED_CODE).send({ message: "User not found" });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).send({ message: "Invalid input data" });
      }
      return next(err);
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
