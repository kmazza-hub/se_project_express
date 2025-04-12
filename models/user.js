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

// Pre-save hook to hash the password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash the password with a salt rounds of 10
  }
  next();
});

// Model creation
const User = mongoose.model("User", userSchema);

module.exports = User;
