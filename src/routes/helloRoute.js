const { Router } = require("express");
const helloRouteHandler = require("../controllers/helloController");

const helloRoute = Router();

helloRoute.get("/", helloRouteHandler);

module.exports = helloRoute;
