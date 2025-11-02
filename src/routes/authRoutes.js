const { Router } = require("express");
const {
  loginPerson,
  createDonor,
  createAdmin,
  logoutPerson,
  forgotPassword,
  resetPassword,
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
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("../schemas/auth");

const authRoutes = Router();

authRoutes.post("/login", validateReqBody(loginSchema), loginPerson);

authRoutes.delete("/logout", validateToken, logoutPerson);

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

authRoutes.post(
  "/forgot-password",
  validateReqBody(forgotPasswordSchema),
  forgotPassword
);

authRoutes.post(
  "/reset-password",
  validateReqBody(resetPasswordSchema),
  resetPassword
);

module.exports = authRoutes;
