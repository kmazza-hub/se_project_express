const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_CODE } = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  console.log("🛠 Incoming Headers:", req.headers);

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED_CODE).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    return next();
  } catch (err) {
    console.error("🔴 JWT Error:", err.message);
    if (err.name === "JsonWebTokenError") {
      return res.status(UNAUTHORIZED_CODE).send({ message: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(UNAUTHORIZED_CODE).send({ message: "Token expired" });
    }
    return res.status(UNAUTHORIZED_CODE).send({ message: "Authorization error" });
  }
};
