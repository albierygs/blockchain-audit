const { Router } = require("express");
const {
  validateToken,
  validateReqBody,
  authorizeRoles,
  validateParamId,
} = require("../middlewares");
const {
  hireMemberSchema,
  terminateMemberSchema,
} = require("../schemas/members");
const {
  getMember,
  hireMember,
  terminateMember,
  getMemberHistory,
} = require("../controllers/members");

const memberRoutes = Router();

memberRoutes.post(
  "/hire",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateReqBody(hireMemberSchema),
  hireMember
);

memberRoutes.get(
  "/:id",
  validateToken,
  authorizeRoles(
    ["ADMIN", "ORG_MEMBER"],
    ["ORG_ADMIN", "AUDITOR", "VOLUNTEER"]
  ),
  validateParamId("ORG_PEER_ACCESS"),
  getMember
);

memberRoutes.get(
  "/:id/history",
  validateToken,
  authorizeRoles(
    ["ADMIN", "ORG_MEMBER"],
    ["ORG_ADMIN", "AUDITOR", "VOLUNTEER"]
  ),
  validateParamId("ORG_PEER_ACCESS"),
  getMemberHistory
);

memberRoutes.put(
  "/:id/dismiss",
  validateToken,
  authorizeRoles(["ORG_MEMBER"], ["ORG_ADMIN"]),
  validateParamId("ORG_PEER_ACTION"),
  validateReqBody(terminateMemberSchema),
  terminateMember
);

module.exports = memberRoutes;
