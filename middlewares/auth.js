const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_CODE } = require("../utils/errors");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(UNAUTHORIZED_CODE).send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { _id: payload._id };
    return next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(UNAUTHORIZED_CODE).send({ message: "Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(UNAUTHORIZED_CODE).send({ message: "Token expired" });
    }
    return res.status(UNAUTHORIZED_CODE).send({ message: "Authorization error" });
  }
};

module.exports = auth;
