const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  // Extract Authorization header
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.warn("Authorization header missing or malformed");
    return res.status(UNAUTHORIZED).json({ message: "Authorization header missing or malformed" });
  }

  // Extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;  // Attach user info to request object
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(UNAUTHORIZED).json({ message: "Invalid token" });
  }
};

module.exports = auth;