const { Router } = require("express");
const { deleteDonor, getDonor, updateDonor } = require("../controllers/donors");
const {
  validateReqBody,
  validateToken,
  authorizeRoles,
  validateParamId,
} = require("../middlewares");
const { updateDonorSchema } = require("../schemas/donors");

const donorsRoute = Router();

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

module.exports = donorsRoute;
