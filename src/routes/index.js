const { Router } = require("express");
const helloRoute = require("./helloRoute");
const donorsRoute = require("./donorsRoutes");
const authRotes = require("./authRoutes");
const memberRoutes = require("./memberRoutes");
const organizationRoutes = require("./organizationRoutes");

const routes = Router();

routes.use("/", helloRoute);
routes.use("/auth", authRotes);
routes.use("/donors", donorsRoute);
routes.use("/members", memberRoutes);
routes.use("/organizations", organizationRoutes);

module.exports = routes;
