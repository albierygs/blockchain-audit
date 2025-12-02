const { Router } = require("express");
const {
  validateToken,
  authorizeRoles,
  validateReqBody,
} = require("../middlewares");
const {
  listBlockchainTransactions,
  getBlockchainTransaction,
  createBlockchainTransaction,
  confirmBlockchainTransaction,
  getBlockchainStatistics,
} = require("../controllers/blockchain");
const { createBlockchainTransactionSchema } = require("../schemas/blockchain");

const blockchainRoutes = Router();

// Rota para listar todas as transações blockchain
blockchainRoutes.get(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "DONOR", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  listBlockchainTransactions
);

// Rota para obter estatísticas de blockchain
blockchainRoutes.get(
  "/statistics",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  getBlockchainStatistics
);

// Rota para obter uma transação blockchain específica
blockchainRoutes.get(
  "/:transactionId",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  getBlockchainTransaction
);

// Rota para criar uma nova transação blockchain
blockchainRoutes.post(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateReqBody(createBlockchainTransactionSchema),
  createBlockchainTransaction
);

// Rota para confirmar uma transação blockchain
blockchainRoutes.patch(
  "/:transactionId/confirm",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  confirmBlockchainTransaction
);

module.exports = blockchainRoutes;
