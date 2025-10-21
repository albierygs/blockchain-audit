const { Router } = require("express");
const helloRoute = require("./helloRoute");
const donorsRoute = require("./donorsRoutes");
const authRotes = require("./authRoutes");
const organizationMemberRoutes = require("./organizationMemberRoutes");
const organizationRoutes = require("./organizationRoutes");

const routes = Router();

routes.use("/", helloRoute);
routes.use("/auth", authRotes);
routes.use("/donors", donorsRoute);
routes.use("/members", organizationMemberRoutes);
routes.use("/organizations", organizationRoutes);

module.exports = routes;
