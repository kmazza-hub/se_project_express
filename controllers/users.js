const User = require("../models/user");
const {
  INTERNAL_SERVER_CODE,
  BAD_REQUEST_CODE,
  NOT_FOUND_CODE,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_CODE).json({ message: "User not found" });
      }
      return res.status(INTERNAL_SERVER_CODE).json({ message: "Internal server error" });
    });
};

const updateCurrentUser = (req, res) => {
  const { name, email } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(userId, { name, email }, { new: true, runValidators: true })
    .then((user) => res.status(200).json(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_CODE).json({ message: "Invalid input data" });
      }
      return res.status(INTERNAL_SERVER_CODE).json({ message: "Internal server error" });
    });
};

// ✅ Make sure these functions are correctly exported
module.exports = { getCurrentUser, updateCurrentUser };
