const { Router } = require("express");
const helloRoute = require("./helloRoute");
const donorsRoute = require("./donorsRoutes");
const authRotes = require("./authRoutes");
const membersRoutes = require("./membersRoutes");
const organizationsRoutes = require("./organizationsRoutes");

const routes = Router();

routes.use("/", helloRoute);
routes.use("/auth", authRotes);
routes.use("/donors", donorsRoute);
routes.use("/members", membersRoutes);
routes.use("/organizations", organizationsRoutes);

module.exports = routes;
