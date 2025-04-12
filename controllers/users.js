const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { INTERNAL_SERVER_ERROR, BAD_REQUEST, UNAUTHORIZED } = require("../utils/errors");
const validator = require("validator");

// Utility function to handle errors
const handleError = (res, error, message, statusCode = INTERNAL_SERVER_ERROR) => {
  console.error(error);
  return res.status(statusCode).json({ message, details: error.message });
};

// Controller for user signup
const createUser = async (req, res) => {
  console.log("📥 Signup attempt:", req.body);

  const { name, password, email, avatar } = req.body;

  // Input validation
  if (!validator.isEmail(email)) {
    return res.status(BAD_REQUEST).json({ message: "Invalid email format" });
  }
  if (!validator.isLength(password, { min: 6 })) {
    return res.status(BAD_REQUEST).json({ message: "Password must be at least 6 characters" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(BAD_REQUEST).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      password: hashedPassword,
      email,
      avatar,
    });

    await newUser.save();
    console.log("✅ User created:", email);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    handleError(res, error, "Failed to create user", BAD_REQUEST);
  }
};

// Controller for user login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Login attempt:", req.body);

  try {
    // Include password explicitly since it's select: false in schema
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      console.warn("❌ User not found for email:", email);
      return res.status(UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    console.log("🔍 Found user:", { _id: user._id, name: user.name, email: user.email, avatar: user.avatar });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.warn("❌ Password does not match for email:", email);
      return res.status(UNAUTHORIZED).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful. Sending token.");
    res.status(200).json({ token });
  } catch (error) {
    handleError(res, error, "Failed to signin", UNAUTHORIZED);
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
    handleError(res, error, "Failed to fetch user profile");
  }
};

// Controller for updating user profile
const updateUser = async (req, res) => {
  const { name, email, avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "User not found" });
    }

    // Input validation
    if (email && !validator.isEmail(email)) {
      return res.status(BAD_REQUEST).json({ message: "Invalid email format" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.avatar = avatar || user.avatar;

    await user.save();
    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    handleError(res, error, "Failed to update user profile");
  }
};

module.exports = {
  createUser,
  loginUser,
  getCurrentUser,
  updateUser,
};
