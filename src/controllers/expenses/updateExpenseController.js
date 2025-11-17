const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const { default: Decimal } = require("decimal.js");
const StatusHistoryService = require("../../services/statusHistoryService");

const updateExpense = async (req, res) => {
  const { id } = req.params; // expense public_id
  const dataToUpdate = req.body;

  // Buscar despesa original para obter o status e outros dados
  const originalExpense = await db.expense.findUnique({
    where: { public_id: id, deleted_at: null },
    select: {
      status: true,
      project_id: true,
      name: true,
      value: true,
      category: true,
    },
  });

  if (!originalExpense) {
    throw new ApiException("Expense not found", 404);
  }

  const oldStatus = originalExpense.status;
  const newStatus = dataToUpdate.status;

  if (
    newStatus &&
    !StatusHistoryService.isValidStatusTransition(
      "EXPENSE",
      oldStatus,
      newStatus
    )
  ) {
    throw new ApiException(
      `Não é possível alterar de ${oldStatus} para ${newStatus}`,
      400
    );
  }

  const result = await db.$transaction(async (tx) => {
    const expense = await tx.expense.findUnique({
      where: { public_id: id, deleted_at: null },
      select: {
        public_id: true,
        project_id: true,
        value: true,
        project: {
          select: {
            goal_amount: true,
          },
        },
      },
    });

    if (!expense) {
      throw new ApiException("Expense not found", 404);
    }

    if (dataToUpdate.value) {
      const aggregate = await tx.expense.aggregate({
        _sum: {
          value: true,
        },
        where: {
          project_id: expense.project_id,
          public_id: {
            not: expense.public_id,
          },
          status: {
            notIn: ["REJECTED", "CANCELLED"],
          },
        },
      });

      const currentExpensesSum = new Decimal(aggregate._sum.value || 0);
      const goalAmount = new Decimal(expense.project.goal_amount);

      const newTotalExpenses = currentExpensesSum.plus(
        new Decimal(dataToUpdate.value)
      );

      if (newTotalExpenses.greaterThan(goalAmount)) {
        throw new ApiException(
          `Expense value ${
            dataToUpdate.value
          } exceeds project's goal amount of ${
            expense.project.goal_amount
          }. Current total expenses: ${expense.value.toFixed(4)}`,
          400
        );
      }
    }

    const updatedExpense = await db.expense.update({
      where: { public_id: id },
      data: {
        ...dataToUpdate,
        payment_date: dataToUpdate.payment_date
          ? new Date(dataToUpdate.payment_date)
          : undefined,
      },
      select: {
        public_id: true,
        project_id: true,
        name: true,
        value: true,
        category: true,
        status: true,
        updated_at: true,
      },
    });

    return updatedExpense;
  });

  // Registrar histórico de status se o status foi alterado
  if (newStatus) {
    try {
      await StatusHistoryService.recordStatusChange(
        "EXPENSE",
        id,
        oldStatus,
        newStatus,
        req.user.publicId,
        `Status da despesa alterado para ${newStatus}`,
        {
          name: result.name,
          value: result.value,
          category: result.category,
          project_id: result.project_id,
        }
      );
    } catch (statusError) {
      console.error(
        "Erro ao registrar status history em updateExpense:",
        statusError
      );
    }
  }

  res.status(200).json(result);
};

module.exports = updateExpense;
