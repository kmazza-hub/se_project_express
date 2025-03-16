const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_CODE,
  INTERNAL_SERVER_CODE,
  NOT_FOUND_CODE,
  CONFLICT_CODE,
  UNAUTHORIZED_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  console.log("🔍 Fetching all users...");
  User.find({})
    .then((users) => {
      console.log("✅ Users fetched successfully:", users);
      res.status(200).send(users);
    })
    .catch((err) => {
      console.error("❌ Error fetching users:", err);
      res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  console.log(`🔍 Fetching user with ID: ${userId}`);
  User.findById(userId)
    .orFail()
    .then((user) => {
      console.log("✅ User found:", user);
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error("❌ Error fetching user:", err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid user ID format" });
      }
      res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  console.log("🛠️ Creating user with data:", { name, avatar, email });
  bcrypt.hash(password, 10)
    .then((hash) => {
      console.log("🔑 Password hashed successfully");
      return User.create({
        name,
        avatar,
        email,
        password: hash,
      });
    })
    .then((user) => {
      const userData = user.toObject();
      delete userData.password;
      console.log("✅ User created:", userData);
      res.status(201).send(userData);
    })
    .catch((err) => {
      console.error("❌ Error creating user:", err);
      if (err.code === 11000) {
        return res
          .status(CONFLICT_CODE)
          .send({ message: "Email already exists" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_CODE)
          .send({ message: "Invalid input data" });
      }
      res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Attempting login for:", email);

  User.findOne({ email }).select("+password")
    .then((user) => {
      if (!user) {
        console.log("❌ User not found");
        return res
          .status(UNAUTHORIZED_CODE)
          .send({ message: "Incorrect email or password" });
      }

      console.log("✅ User found:", user);
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          console.log("❌ Password does not match");
          return res
            .status(UNAUTHORIZED_CODE)
            .send({ message: "Incorrect email or password" });
        }

        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });

        console.log("✅ Token generated:", token);
        res.send({ token });
      });
    })
    .catch((err) => {
      console.error("❌ Error during login:", err);
      res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

const getCurrentUser = (req, res) => {
  console.log(`🔍 Fetching current user with ID: ${req.user._id}`);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        console.log("❌ User not found");
        return res.status(NOT_FOUND_CODE).send({ message: "User not found" });
      }
      console.log("✅ Current user:", user);
      res.send(user);
    })
    .catch((err) => {
      console.error("❌ Error fetching current user:", err);
      res
        .status(INTERNAL_SERVER_CODE)
        .send({ message: "An internal error has occurred on the server" });
    });
};

module.exports = { getUsers, createUser, getUser, login, getCurrentUser };
