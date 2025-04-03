const express = require("express");
const { celebrate, Joi } = require("celebrate");
const { login, register } = require("../controllers/auth");

const router = express.Router();

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

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  register
);

module.exports = router;
