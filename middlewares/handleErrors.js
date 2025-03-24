/* eslint-disable no-unused-vars */
const handleErrors = (err, req, res, _next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({ message: statusCode === 500 ? "Internal Server Error" : message });
};
/* eslint-enable no-unused-vars */

module.exports = handleErrors;
