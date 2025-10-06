const { Router } = require("express");
const helloRoute = require("./helloRoute");
const donorsRoute = require("./donorsRoute");

const routes = Router();

routes.use("/", helloRoute);
routes.use("/donors", donorsRoute);

module.exports = routes;
