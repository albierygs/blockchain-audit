const { Router } = require("express");
const {
  validateToken,
  authorizeRoles,
  validateParamId,
  validateReqBody,
} = require("../middlewares");
const {
  createExpenseSchema,
  updateExpenseSchema,
} = require("../schemas/expenses");
const {
  createExpense,
  listExpenses,
  getExpense,
  updateExpense,
  deleteExpense,
  approveExpense,
} = require("../controllers/expenses");

// Roteador aninhado sob projetos (/projects/:id/expenses)
const projectExpensesRoutes = Router({ mergeParams: true });

// Criar despesa para um projeto
projectExpensesRoutes.post(
  "/",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  validateParamId("ORG_PROJECT_ACTION"), // :id é o project_id
  validateReqBody(createExpenseSchema),
  createExpense
);

// Listar despesas de um projeto
projectExpensesRoutes.get(
  "/",
  validateToken,
  authorizeRoles(
    ["ADMIN", "ORG_MEMBER"],
    ["ORG_ADMIN", "AUDITOR", "VOLUNTEER"]
  ),
  validateParamId("ORG_PROJECT_ACTION"), // :id é o project_id
  listExpenses
);

// Roteador para despesas individuais (/expenses/:id)
const singleExpenseRoutes = Router();

// Obter despesa específica
singleExpenseRoutes.get(
  "/:id",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER", "DONOR"]),
  validateParamId("ORG_EXPENSE_ACCESS"),
  getExpense
);

// Atualizar despesa
singleExpenseRoutes.put(
  "/:id",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  validateParamId("ORG_EXPENSE_ACTION"),
  validateReqBody(updateExpenseSchema),
  updateExpense
);

// Aprovar despesa (função específica)
singleExpenseRoutes.patch(
  "/:id/approve",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN", "AUDITOR"]),
  validateParamId("ORG_EXPENSE_ACTION"),
  approveExpense
);

// Deletar despesa
singleExpenseRoutes.delete(
  "/:id",
  validateToken,
  authorizeRoles(["ADMIN", "ORG_MEMBER"], ["ORG_ADMIN"]),
  validateParamId("ORG_EXPENSE_ACTION"),
  deleteExpense
);

module.exports = { projectExpensesRoutes, singleExpenseRoutes };
