const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");

const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const ConflictError = require("../errors/ConflictError");
const NotFoundError = require("../errors/NotFoundError");

// Controller for user signup
const createUser = async (req, res, next) => {
  const { name, password, email, avatar } = req.body;

  if (!validator.isEmail(email)) {
    return next(new BadRequestError("Invalid email format"));
  }
  if (!validator.isLength(password, { min: 6 })) {
    return next(new BadRequestError("Password must be at least 6 characters"));
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError("User already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      password: hashedPassword,
      email,
      avatar,
    });

    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email, name: newUser.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

// Controller for user login
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new UnauthorizedError("Invalid credentials"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new UnauthorizedError("Invalid credentials"));
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

// Controller for fetching current user profile
const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new NotFoundError("User not found"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// Controller for updating user profile
const updateUser = async (req, res, next) => {
  const { name, email, avatar } = req.body;

  try {
    if (email && !validator.isEmail(email)) {
      return next(new BadRequestError("Invalid email format"));
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, avatar },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new NotFoundError("User not found"));
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
