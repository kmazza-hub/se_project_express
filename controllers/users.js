const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } = require("../utils/errors");

// Controller for user signup
const createUser = async (req, res) => {
  const { name, password, email, avatar } = req.body; // Destructure name, password, email, and avatar

  try {
    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object with name, password, email, and avatar
    const newUser = new User({
      name,       // Use 'name' instead of 'username'
      password: hashedPassword,
      email,
      avatar,     // Add avatar
    });

    // Save the user to the database
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
  const { name, email, avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "User not found" });
    }

    user.name = name || user.name;       // Update name if provided
    user.email = email || user.email;     // Update email if provided
    user.avatar = avatar || user.avatar; // Update avatar if provided

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
