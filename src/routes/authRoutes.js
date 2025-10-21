const { Router } = require("express");
const {
  loginPerson,
  createDonor,
  createMember,
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
  createMemberSchema,
  createAdminSchema,
} = require("../schemas/auth");

const authRoutes = Router();

authRoutes.post("/login", validateReqBody(loginSchema), loginPerson);

authRoutes.post(
  "/register/donor",
  validateReqBody(createDonorSchema),
  createDonor
);

authRoutes.use(
  "/register/member",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateReqBody(createMemberSchema),
  createMember
);

authRoutes.use(
  "/register/admin",
  validateToken,
  authorizeRoles(["ADMIN"]),
  validateReqBody(createAdminSchema),
  createAdmin
);

module.exports = authRoutes;
