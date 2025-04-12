const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

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
    validate: {
      validator(value) {
        return validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true });
      },
      message: "You must enter a valid URL for the avatar",
    },
    // Optional: Default avatar in case user doesn't provide one
    default: 'https://i.pravatar.cc/150?img=0',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // Ensure password is not returned in queries by default
  },
});

// Model creation
const User = mongoose.model("User", userSchema);

module.exports = User;
