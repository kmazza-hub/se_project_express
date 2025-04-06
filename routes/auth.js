const express = require("express");
const { celebrate, Joi } = require("celebrate");
const { login, createUser } = require("../controllers/auth");  // Check if these are correct imports

const router = express.Router();

// Sign in route
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

// Sign up route
router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser  // Ensure the function name is correct here as well
);

module.exports = router;
