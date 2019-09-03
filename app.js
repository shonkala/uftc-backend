const config = require("./utils/config");
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const passport = require("passport");

const usersRouter = require("./routes/users");
const challengesRouter = require("./routes/challenges");
const workoutRouter = require("./routes/workouts");
const activityRouter = require("./routes/activities");
const scoresRouter = require("./routes/scores");
const achievementsRouter = require("./routes/achievements");
const passwordsRouter = require("./routes/passwords");

const {
  unknownEndpoint,
  errorHandler,
  requestLogger
} = require("./utils/middleware");
const logger = require("./utils/logger");

app.use(passport.initialize());
require("./passport-config")(passport);

app.use(cors()); // todo: configure this
app.use(express.json({ extended: false }));
//app.use(requestLogger);

// fix deprecation warnings
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

logger.info("connecting to", config.MONGODB_URI);
mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch(error => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use("/api/users", usersRouter);
app.use("/api/challenges", challengesRouter);
app.use("/api/workouts", workoutRouter);
app.use("/api/activities", activityRouter);
app.use("/api/scores", scoresRouter);
app.use("/api/achievements", achievementsRouter);
app.use("/api/passwords", passwordsRouter);

if (app.get("env") === "test") {
  //process.env.NODE_ENV === 'test ?
  const testingRouter = require("./routes/testing");
  app.use("/api/testing", testingRouter);
}

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
