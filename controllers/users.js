const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } = require("../utils/errors");

// Controller for user signup
const createUser = async (req, res) => {
  const { name, password, email, avatar } = req.body;

  try {
    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new User({
      name,
      password: hashedPassword,
      email,
      avatar,
    });

    // Save the user
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to create user" });
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    // Create and send token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to signin" });
  }
};

// Controller for fetching current user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to fetch user profile" });
  }
};

// Controller for updating current user profile
const updateUser = async (req, res) => {
  const { name, email, avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;

    await user.save();
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(INTERNAL_SERVER_ERROR).json({ message: "Failed to update user profile" });
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
