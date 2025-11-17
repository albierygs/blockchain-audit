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
const statusHistoryRoutes = require("./statusHistoryRoutes");

const memberRoutes = Router({ mergeParams: true });

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

// Rotas de histórico de status para membros
memberRoutes.use(
  "/:id/status-history",
  (req, res, next) => {
    res.locals.entityId = req.params.id;
    res.locals.entityType = "MEMBER";
    next();
  },
  statusHistoryRoutes
);

module.exports = memberRoutes;
