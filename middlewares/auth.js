const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UNAUTHORIZED = require("../utils/constants");

module.exports = (req, res, next) => {
  if (
    req.method === "POST" &&
    (req.path === "/signin" || req.path === "/signup")
  ) {
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED).send({ message: "Authorization required" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return res.status(UNAUTHORIZED).send({ message: "Invalid token" });
  }
};