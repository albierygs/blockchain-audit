const { Router } = require("express");
const { deleteDonor, getDonor, updateDonor } = require("../controllers/donors");
const {
  validateReqBody,
  validateToken,
  authorizeRoles,
  validateParamId,
} = require("../middlewares");
const { updateDonorSchema } = require("../schemas/donors");
const statusHistoryRoutes = require("./statusHistoryRoutes");

const donorsRoute = Router({ mergeParams: true });

donorsRoute.get(
  "/:id",
  validateToken,
  authorizeRoles(["DONOR", "ADMIN"]),
  validateParamId("SELF"),
  getDonor
);

donorsRoute.put(
  "/:id",
  validateToken,
  authorizeRoles(["DONOR", "ADMIN"]),
  validateParamId("SELF"),
  validateReqBody(updateDonorSchema),
  updateDonor
);

donorsRoute.delete(
  "/:id",
  validateToken,
  authorizeRoles(["DONOR", "ADMIN"]),
  validateParamId("SELF"),
  deleteDonor
);

// Rotas de histórico de status para doadores (entidade PERSON)
donorsRoute.use(
  "/:id/status-history",
  (req, res, next) => {
    res.locals.entityId = req.params.id;
    res.locals.entityType = "PERSON";
    next();
  },
  statusHistoryRoutes
);

module.exports = donorsRoute;
