const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } = require("../utils/errors");

// Controller for user signup
const createUser = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

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
  const { username, email } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "User not found" });
    }

    user.username = username || user.username;
    user.email = email || user.email;

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
