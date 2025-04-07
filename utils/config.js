
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your_default_secret_key";

module.exports = { JWT_SECRET };
