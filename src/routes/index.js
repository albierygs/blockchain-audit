const { Router } = require("express");
const helloRoute = require("./helloRoute");

const routes = Router();

routes.use("/", helloRoute);

module.exports = routes;
