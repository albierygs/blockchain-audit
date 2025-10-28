const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const { default: Decimal } = require("decimal.js");

const updateExpense = async (req, res) => {
  const { id } = req.params; // expense public_id
  const dataToUpdate = req.body;

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

  res.status(200).json(result);
};

module.exports = updateExpense;
