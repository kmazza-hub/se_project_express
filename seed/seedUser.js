require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/se_project_db";

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "test@example.com";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`⚠️ User with email ${email} already exists. Skipping seeding.`);
      return true;
    }

    const passwordHash = await bcrypt.hash("testpassword", 10);

    const user = await User.create({
      name: "Test User",
      email,
      password: passwordHash,
    });

    console.log("✅ Seeded user:", user);
    return true;
  } catch (err) {
    console.error("❌ Seeding error:", err);
    return false;
  } finally {
    process.exit(0);
  }
}

seed();
