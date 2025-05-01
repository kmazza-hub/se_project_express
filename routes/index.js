const express = require('express');
const { validateSignin, validateSignup } = require('../middlewares/validation.js');
const { loginUser, createUser } = require('../controllers/users.js');
const NotFoundError = require('../errors/NotFoundError.js');
const clothingItemRouter = require('./clothingItems.js');
const userRouter = require('./users.js');
const { getWeather } = require('../controllers/weather.js');

const router = express.Router();

// Auth routes
router.post('/signin', validateSignin, loginUser);
router.post('/signup', validateSignup, createUser);

// Main routes
router.use('/users', userRouter);
router.use('/items', clothingItemRouter);

// Weather route
router.get('/weather', getWeather);

// 404 fallback
router.use((req, res, next) => {
  next(new NotFoundError('Requested resource not found'));
});

module.exports = router;
