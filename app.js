const express = require("express");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const { createUser, login } = require("./controllers/users");
const routes = require("./routes/index");
const { PORT, MONGO_URL } = require("./utils/config");

const app = express();

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.post("/signup", createUser);
app.post("/signin", login);

app.use("/", routes);

app.use((req, res) => {
  res.status(404).send({ message: "Resource not found" });
});

app.use(errors());

app.use((err, req, res) => {
  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).send({ message });
});

app.listen(PORT);
