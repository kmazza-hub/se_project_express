const bcrypt = require("bcrypt");
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
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator(value) {
        return validator.isEmail(value);
      },
      message: "Invalid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false, // Make sure the password is not returned in queries unless explicitly selected
  },
});

// Hash password before saving user
userSchema.pre('save', function(next) {
  if (!this.isModified('password')) return next(); // Don't hash the password if it isn't modified

  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    if (err) return next(err);

    this.password = hashedPassword; // Save the hashed password
    next();
  });
});

// Static method to find user by credentials (login validation)
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password") // Include the password field since it's excluded by default
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }

      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user;
      });
    });
};

module.exports = mongoose.model("user", userSchema);
