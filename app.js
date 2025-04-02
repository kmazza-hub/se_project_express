const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { errors } = require("celebrate");
const logger = require("./utils/logger");
require("dotenv").config();

const usersRouter = require("./routes/users");
const clothingItemsRouter = require("./routes/clothingItem");
const authRouter = require("./routes/auth");
const handleErrors = require("./middlewares/handleErrors");

const { PORT = 3001, MONGO_URL = "mongodb://localhost:27017/wtwr" } = process.env;

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => logger.info("Connected to MongoDB"))
  .catch((err) => logger.error("Error connecting to MongoDB:", err));

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRouter);
app.use("/users", usersRouter);
app.use("/items", clothingItemsRouter);

app.use(errors());
app.use(handleErrors);

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on http://localhost:${PORT}`);
});
