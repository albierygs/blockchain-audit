const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const { default: Decimal } = require("decimal.js");

const createExpense = async (req, res) => {
  const projectId = req.params.id;
  const {
    name,
    description,
    value,
    category,
    payment_date,
    receipt_url,
    invoice_number,
  } = req.body;

  const newExpenseValue = new Decimal(value);

  const result = await db.$transaction(async (tx) => {
    const project = await tx.project.findUnique({
      where: { public_id: projectId, deleted_at: null },
      select: {
        goal_amount: true,
      },
    });

    if (!project) {
      throw new ApiException("Project not found", 404);
    }

    const aggregate = await tx.expense.aggregate({
      _sum: {
        value: true,
      },
      where: {
        project_id: projectId,
        status: {
          notIn: ["REJECTED", "CANCELLED"],
        },
      },
    });

    const currentExpensesSum = new Decimal(aggregate._sum.value || 0);
    const goalAmount = new Decimal(project.goal_amount);

    const newTotalExpenses = currentExpensesSum.plus(newExpenseValue);

    if (newTotalExpenses.greaterThan(goalAmount)) {
      throw new ApiException(
        `Expense value ${value} exceeds project's goal amount of ${
          project.goal_amount
        }. Current total expenses: ${currentExpensesSum.toFixed(4)}`,
        400
      );
    }

    const expense = await tx.expense.create({
      data: {
        project_id: projectId,
        name,
        description,
        value,
        category,
        payment_date: payment_date ? new Date(payment_date) : null,
        receipt_url,
        invoice_number,
        created_by: req.user.publicId,
        status: "PENDING",
      },
      select: {
        public_id: true,
        project_id: true,
        name: true,
        value: true,
        category: true,
        status: true,
        created_at: true,
      },
    });

    return expense;
  });

  res.status(201).json(result);
};

module.exports = createExpense;
