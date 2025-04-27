// src/middlewares/validation.js

const { celebrate, Joi } = require("celebrate");

// Validation for signing up
const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().uri().required(), // avatar must be a valid URL
  }),
});

// Validation for logging in
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validation for itemId (in params)
const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateItemId,
};
