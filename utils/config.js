// utils/config.js

require("dotenv").config();

const isProduction = process.env.NODE_ENV === "production";

module.exports = {
  JWT_SECRET: isProduction
    ? process.env.JWT_SECRET
    : "dev-secret",
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/wtwr",
};
