const { Router } = require("express");
const {
  createDonor,
  loginDonor,
  deleteDonor,
  getDonor,
  updateDonor,
} = require("../controllers/donors");
const {
  validateReqBodyCreateDonor,
  validateReqBodyLoginDonor,
  validateToken,
  validateParam,
  validateReqBodyUpdateDonor,
} = require("../middlewares");

const donorsRoute = Router();

donorsRoute.get("/:id", validateToken, validateParam, getDonor);
donorsRoute.post("/auth/new", validateReqBodyCreateDonor, createDonor);
donorsRoute.post("/auth/login", validateReqBodyLoginDonor, loginDonor);
donorsRoute.put(
  "/:id",
  validateToken,
  validateParam,
  validateReqBodyUpdateDonor,
  updateDonor
);
donorsRoute.delete("/:id", validateToken, validateParam, deleteDonor);

module.exports = donorsRoute;
