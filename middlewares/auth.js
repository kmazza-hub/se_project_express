const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");
const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(UNAUTHORIZED).json({ message: "Authorization token is missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);

    if (!user) {
      return res.status(UNAUTHORIZED).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);

    if (error.name === "JsonWebTokenError") {
      return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(UNAUTHORIZED).json({ message: "Token has expired" });
    }

    res.status(UNAUTHORIZED).json({ message: "Authentication failed. Invalid or expired token" });
  }
};

module.exports = auth;
