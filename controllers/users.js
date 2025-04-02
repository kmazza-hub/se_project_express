const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const logger = require("../utils/logger");
const {
  BAD_REQUEST_CODE,
  UNAUTHORIZED_CODE,
  CONFLICT_CODE,
} = require("../utils/errors");

const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Email already exists: ${email}`);
      return res
        .status(CONFLICT_CODE)
        .json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    logger.info(`User created: ${newUser._id}`);

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (err) {
    if (err.code === 11000) {
      logger.error(`Database error: ${err.message}`);
      return res
        .status(CONFLICT_CODE)
        .json({ message: "Email already exists" });
    }
    if (err.name === "ValidationError") {
      logger.error(`Validation error: ${err.message}`);
      return res
        .status(BAD_REQUEST_CODE)
        .json({ message: "Invalid input data" });
    }
    logger.error(`Error in creating user: ${err.message}`);
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(`Failed login attempt for email: ${email}`);
      return res
        .status(UNAUTHORIZED_CODE)
        .json({ message: "Incorrect email or password" });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    const refreshToken = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "30d" });

    logger.info(`User logged in: ${user._id}`);

    return res.json({ accessToken: token, refreshToken });
  } catch (err) {
    logger.error(`Error during login: ${err.message}`);
    return next(err);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      logger.warn("No refresh token provided");
      return res.status(UNAUTHORIZED_CODE).json({ message: "Refresh token is required" });
    }

    const payload = jwt.verify(refreshToken, JWT_SECRET);

    const newAccessToken = jwt.sign({ _id: payload._id }, JWT_SECRET, { expiresIn: "7d" });

    logger.info(`New access token generated for user: ${payload._id}`);

    return res.json({ accessToken: newAccessToken });
  } catch (err) {
    logger.error(`Invalid refresh token: ${err.message}`);
    return res.status(UNAUTHORIZED_CODE).json({ message: "Invalid refresh token" });
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      logger.warn(`User not found: ${req.user._id}`);
      return res.status(UNAUTHORIZED_CODE).json({ message: "User not found" });
    }

    logger.info(`Current user fetched: ${user._id}`);

    return res.json(user);
  } catch (err) {
    logger.error(`Error fetching current user: ${err.message}`);
    return next(err);
  }
};

const updateCurrentUser = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      logger.warn(`User not found for update: ${req.user._id}`);
      return res.status(UNAUTHORIZED_CODE).json({ message: "User not found" });
    }

    logger.info(`User updated: ${updatedUser._id}`);

    return res.json(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      logger.error(`Validation error during update: ${err.message}`);
      return res
        .status(BAD_REQUEST_CODE)
        .json({ message: "Invalid input data" });
    }
    logger.error(`Error during user update: ${err.message}`);
    return next(err);
  }
};

module.exports = {
  createUser,
  login,
  refreshAccessToken,
  getCurrentUser,
  updateCurrentUser,
};
