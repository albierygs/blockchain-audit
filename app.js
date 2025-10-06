const express = require("express");
const cors = require("cors");
const routes = require("./src/routes");
const { errorHandler, unknownEndpoint } = require("./src/middlewares");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
