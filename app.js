// src/app.js

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate'); // for celebrate validation errors
const mainRouter = require('./routes');
const { requestLogger, errorLogger } = require('./middlewares/logger'); // << ✅ new
const errorHandler = require('./middlewares/error-handler'); // centralized error handler

const app = express();

app.use(cors());
app.use(express.json());

// ✅ Request logger BEFORE routes
app.use(requestLogger);

// ✅ Main routes
app.use('/', mainRouter);

// ✅ Error logger AFTER routes
app.use(errorLogger);

// ✅ Celebrate errors
app.use(errors());

// ✅ Centralized error handler
app.use(errorHandler);

mongoose
  .connect('mongodb://localhost:27017/wtwr')
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3001, () => console.log('Server running at http://localhost:3001'));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
