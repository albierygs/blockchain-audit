const { Router } = require("express");
const helloRoute = require("./helloRoute");
const donorsRoute = require("./donorsRoutes");
const authRotes = require("./authRoutes");
const membersRoutes = require("./membersRoutes");
const organizationsRoutes = require("./organizationsRoutes");
const { projectsRoutes, singleProjectRoutes } = require("./projectsRoutes");
const {
  projectExpensesRoutes,
  singleExpenseRoutes,
} = require("./expensesRoutes");

const routes = Router();

routes.use("/", helloRoute);
routes.use("/auth", authRotes);
routes.use("/donors", donorsRoute);
routes.use("/members", membersRoutes);
routes.use("/organizations", organizationsRoutes);
routes.use("/organizations/:id/projects", projectsRoutes);
routes.use("/projects", singleProjectRoutes);
routes.use("/projects/:id/expenses", projectExpensesRoutes);
routes.use("/expenses", singleExpenseRoutes);

module.exports = routes;
