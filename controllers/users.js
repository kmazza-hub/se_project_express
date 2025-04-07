const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  UNAUTHORIZED,
  INTERNAL_SERVER_ERROR,
  CONFLICT,
} = require("../utils/errors");

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token });
  } catch (error) {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Server error during login" });
  }
};

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;
  try {
    const user = await User.create({ name, avatar, email, password });
    const { password: _, ...userData } = user.toObject();
    res.status(201).json(userData);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(CONFLICT).json({ message: "Email already in use" });
    }
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: error.message });
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Server error during signup" });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { password, ...userData } = user.toObject();
    res.status(200).json(userData);
  } catch {
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to retrieve user" });
  }
};

const updateUser = async (req, res) => {
  const { name, avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    const { password, ...userData } = user.toObject();
    res.status(200).json(userData);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(BAD_REQUEST).json({ message: error.message });
    }
    res
      .status(INTERNAL_SERVER_ERROR)
      .json({ message: "Failed to update profile" });
  }
};

module.exports = {
  loginUser,
  createUser,
  getCurrentUser,
  updateUser,
};
