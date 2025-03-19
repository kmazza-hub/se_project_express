require("dotenv").config();

const {
  JWT_SECRET = "dev-key",
  MONGO_URL = "mongodb://127.0.0.1:27017/wtwr_db",
  PORT = 3001
} = process.env;

module.exports = {
  JWT_SECRET,
  MONGO_URL,
  PORT,
};
