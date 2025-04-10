module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret", // Replace with a secure secret in production
  MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/wtwr", // MongoDB URI
};
