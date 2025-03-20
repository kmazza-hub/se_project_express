const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    default: "https://default-avatar.com",
    validate: {
      validator: (url) => validator.isURL(url, { protocols: ["http", "https"], require_protocol: true }),
      message: "Invalid URL format",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [validator.isEmail, "Invalid email format"],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

module.exports = mongoose.model("User", userSchema);
