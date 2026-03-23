const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const { errorHandler, unknownEndpoint } = require("./src/middlewares");
const { FRONTEND_URL } = require("./src/utils/constants");

const app = express();

app.use(
  cors({
    origin: FRONTEND_URL,
  }),
);
app.use(express.json());

app.use("/api", routes);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
