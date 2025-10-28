const { Router } = require("express");
const {
  loginPerson,
  createDonor,
  createAdmin,
} = require("../controllers/auth/");
const {
  validateReqBody,
  authorizeRoles,
  validateToken,
} = require("../middlewares");
const {
  loginSchema,
  createDonorSchema,
  createAdminSchema,
} = require("../schemas/auth");

const authRoutes = Router();

authRoutes.post("/login", validateReqBody(loginSchema), loginPerson);

authRoutes.post(
  "/register/donor",
  validateReqBody(createDonorSchema),
  createDonor
);

authRoutes.post(
  "/register/admin",
  validateToken,
  authorizeRoles(["ADMIN"]),
  validateReqBody(createAdminSchema),
  createAdmin
);

module.exports = authRoutes;
