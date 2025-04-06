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

module.exports = {
  createUser,
  login,
};
