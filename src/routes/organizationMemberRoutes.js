const { Router } = require("express");
const {
  validateToken,
  validateReqBody,
  authorizeRoles,
} = require("../middlewares");
const { createMemberSchema } = require("../schemas/members");

const organizationMemberRoutes = Router();

module.exports = organizationMemberRoutes;
