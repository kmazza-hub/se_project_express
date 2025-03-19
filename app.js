const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const auth = require("./middlewares/auth");
const { createUser, login } = require("./controllers/users.js");
const clothingRoutes = require("./routes/clothingItem");
const usersRoutes = require("./routes/users");
const { PORT, MONGO_URL } = require("./utils/config");

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  console.log(`🚀 Server running on port ${PORT}`);
}

// 🔍 Debugging logs
console.log("🔍 Checking controllers:");
console.log("✅ createUser:", typeof createUser);
console.log("✅ login:", typeof login);

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/users", auth, usersRoutes);
app.use("/clothingItems", clothingRoutes);

app.use(errors());

app.use((err, req, res) => {
  console.error("🔥 Server Error:", err);
  res.status(500).send({ message: "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
});
