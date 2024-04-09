const express = require("express");
require("dotenv").config();
const config = require("./utils/config");
const cors = require("cors");
const userRouter = require("./controllers/user");
const logger = require("./utils/logger");
const mongoose = require("mongoose");
const recipeRouter = require("./controllers/recipe");
const middleware = require("./utils/middleware");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));
app.use(middleware.requestLogger);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
