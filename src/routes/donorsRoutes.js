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
  validateParamId("PERSON"),
  getDonor
);

donorsRoute.put(
  "/:id",
  validateToken,
  authorizeRoles(["DONOR", "ADMIN"]),
  validateParamId("PERSON"),
  validateReqBody(updateDonorSchema),
  updateDonor
);

donorsRoute.delete(
  "/:id",
  validateToken,
  authorizeRoles(["DONOR", "ADMIN"]),
  validateParamId("PERSON"),
  deleteDonor
);

module.exports = donorsRoute;
