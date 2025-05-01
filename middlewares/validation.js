const { celebrate, Joi } = require("celebrate");

// Validation for signing up
const validateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().uri().required(),
  }),
});

// Validation for logging in
const validateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

// Validation for clothing item creation
const validateItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    imageUrl: Joi.string().required().uri(),
    weather: Joi.string().required().valid("hot", "warm", "cold"),
    description: Joi.string().optional(),
  }),
});

// Validation for item ID in params
const validateItemId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).hex().required(),
  }),
});

// Validation for updating user profile
const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().uri(),
  }),
});

module.exports = {
  validateSignup,
  validateSignin,
  validateItemId,
  validateItem,
  validateUpdateUser,
};
