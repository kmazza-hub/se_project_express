// src/middlewares/error-handler.js
function errorHandler(err, req, res, next) {
  console.error(err.stack); // Log error stack for debugging
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).send({ message });
}

module.exports = errorHandler;
