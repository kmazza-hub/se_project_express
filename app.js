require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const mainRouter = require("./routes/index.js");
const { requestLogger, errorLogger } = require("./middlewares/logger.js");
const errorHandler = require("./middlewares/error-handler.js");
const { MONGO_URL } = require("./utils/config.js"); // ✅ Import MONGO_URL from config

const app = express();

// ✅ Middleware setup
app.use(cors());
app.use(express.json());

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ Server is alive and accessible!");
});

// ✅ Crash test route (for review purposes)
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// ✅ Log requests before routing
app.use(requestLogger);

// ✅ Main routes
app.use("/", mainRouter);

// ✅ Log errors after routing
app.use(errorLogger);

// ✅ Celebrate validation errors
app.use(errors());

// ✅ Central error handler
app.use(errorHandler);

// ✅ Connect to MongoDB and start server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected");
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running at http://0.0.0.0:${PORT}`);
    });
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));
