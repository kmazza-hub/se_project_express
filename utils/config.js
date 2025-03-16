require("dotenv").config();

const { JWT_SECRET, MONGO_URL, PORT = 3001 } = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
  PORT,
};
