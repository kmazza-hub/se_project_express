const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../utils/config.js');
const UnauthorizedError = require('../errors/UnauthorizedError.js');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Authorization header missing or malformed'));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (error) {
    return next(new UnauthorizedError('Invalid token'));
  }
};

module.exports = auth;
