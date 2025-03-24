const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
require("dotenv").config();

const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItem");
const authRouter = require("./routes/auth"); // ✅ Import auth routes
const handleErrors = require("./middlewares/handleErrors");

const { PORT = 3001, MONGO_URL = "mongodb://localhost:27017/wtwr" } = process.env;

const app = express();

// Connect to MongoDB
mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// CORS Configuration
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/", authRouter); // ✅ Add auth routes
app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);

// Error Handling
app.use(errors());
app.use(handleErrors);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
