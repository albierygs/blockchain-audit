const { Router } = require("express");
const {
  validateToken,
  authorizeRoles,
  validateReqBody,
} = require("../middlewares");
const {
  listVolunteerLogs,
  getVolunteerLog,
  createVolunteerLog,
  approveVolunteerLog,
  rejectVolunteerLog,
} = require("../controllers/volunteerLogs");
const { createVolunteerLogSchema } = require("../schemas/volunteerLogs");
const statusHistoryRoutes = require("./statusHistoryRoutes");

const volunteerLogsRoutes = Router({ mergeParams: true });

// Rota para listar logs de um membro específico
volunteerLogsRoutes.get(
  "/",
  validateToken,
  authorizeRoles(
    ["ADMIN", "ORG_MEMBER"],
    ["ORG_ADMIN", "AUDITOR", "VOLUNTEER"]
  ),
  listVolunteerLogs
);

// Rota para obter um log específico
volunteerLogsRoutes.get(
  "/:logId",
  validateToken,
  authorizeRoles(
    ["ADMIN", "ORG_MEMBER"],
    ["ORG_ADMIN", "AUDITOR", "VOLUNTEER"]
  ),
  getVolunteerLog
);

// Rota para criar um novo log (apenas voluntários podem criar)
volunteerLogsRoutes.post(
  "/",
  validateToken,
  authorizeRoles(["ORG_MEMBER"], ["VOLUNTEER"]),
  validateReqBody(createVolunteerLogSchema),
  createVolunteerLog
);

// Rota para aprovar um log (apenas administradores/auditores podem aprovar)
volunteerLogsRoutes.patch(
  "/:logId/approve",
  validateToken,
  authorizeRoles(["ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  approveVolunteerLog
);

// Rota para rejeitar um log
volunteerLogsRoutes.patch(
  "/:logId/reject",
  validateToken,
  authorizeRoles(["ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  rejectVolunteerLog
);

// Rotas de histórico de status para logs de voluntários
volunteerLogsRoutes.use(
  "/:logId/status-history",
  (req, res, next) => {
    res.locals.entityId = req.params.logId;
    res.locals.entityType = "VOLUNTEER_LOG";
    next();
  },
  statusHistoryRoutes
);

module.exports = volunteerLogsRoutes;
