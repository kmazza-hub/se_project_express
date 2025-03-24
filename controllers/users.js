const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  CONFLICT_CODE,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// Create User
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(CONFLICT_CODE)
        .json({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ message: "Invalid input data" });
    }
    return next(err);
  }
};

// Login User
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(UNAUTHORIZED_CODE)
        .json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res.json({ token });
  } catch (err) {
    return next(err);
  }
};

// Get Current User
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(UNAUTHORIZED_CODE).json({ message: "User not found" });
    }

    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

// Update Current User
const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(UNAUTHORIZED_CODE).json({ message: "User not found" });
    }

    return res.json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return res
        .status(BAD_REQUEST_CODE)
        .json({ message: "Invalid input data" });
    }
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
