const { Router } = require("express");
const {
  validateToken,
  authorizeRoles,
  validateReqBody,
} = require("../middlewares");
const {
  listAllocations,
  getAllocation,
  createAllocation,
  updateAllocation,
} = require("../controllers/allocations");
const {
  createAllocationSchema,
  updateAllocationSchema,
} = require("../schemas/allocations");

const allocationsRoutes = Router();

// Rota para listar todas as alocações
allocationsRoutes.get(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "DONOR", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  listAllocations
);

// Rota para obter uma alocação específica
allocationsRoutes.get(
  "/:allocationId",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  getAllocation
);

// Rota para criar uma nova alocação
allocationsRoutes.post(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateReqBody(createAllocationSchema),
  createAllocation
);

// Rota para atualizar uma alocação
allocationsRoutes.put(
  "/:allocationId",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateReqBody(updateAllocationSchema),
  updateAllocation
);

module.exports = allocationsRoutes;
