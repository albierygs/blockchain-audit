const { Router } = require("express");
const {
  validateToken,
  authorizeRoles,
  validateReqBody,
} = require("../middlewares");
const {
  listStatusHistory,
  getStatusHistory,
  createStatusHistory,
} = require("../controllers/statusHistory");
const { createStatusHistorySchema } = require("../schemas/statusHistory");

const statusHistoryRoutes = Router({ mergeParams: true });

// Rota para listar o histórico de status de uma entidade
statusHistoryRoutes.get(
  "/",
  validateToken,
  authorizeRoles(
    ["ADMIN", "ORG_MEMBER"],
    ["ORG_ADMIN", "AUDITOR", "VOLUNTEER"]
  ),
  listStatusHistory
);

// Rota para obter um registro específico de histórico de status
statusHistoryRoutes.get(
  "/:historyId",
  validateToken,
  authorizeRoles(
    ["ADMIN", "ORG_MEMBER"],
    ["ORG_ADMIN", "AUDITOR", "VOLUNTEER"]
  ),
  getStatusHistory
);

// Rota para criar um novo registro de histórico de status
statusHistoryRoutes.post(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateReqBody(createStatusHistorySchema),
  createStatusHistory
);

module.exports = statusHistoryRoutes;
