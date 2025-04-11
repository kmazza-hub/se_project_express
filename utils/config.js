require("dotenv").config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/wtwr",
};
