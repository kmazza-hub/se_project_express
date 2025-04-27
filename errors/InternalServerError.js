// errors/InternalServerError.js

class InternalServerError extends Error {
  constructor(message = "An internal server error occurred.") {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
