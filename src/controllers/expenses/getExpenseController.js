const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const getExpense = async (req, res) => {
  const { id } = req.params; // expense public_id

  const expense = await db.expense.findUnique({
    where: { public_id: id },
    include: {
      project: {
        select: {
          title: true,
          organization_id: true,
        },
      },
    },
  });

  if (!expense) {
    throw new ApiException("Expense not found", 404);
  }

  // O middleware ORG_EXPENSE_ACCESS já validou a permissão

  const response = {
    ...expense,
    project_title: expense.project.title,
    organization_id: expense.project.organization_id,
    project: undefined,
  };

  res.status(200).json(response);
};

module.exports = getExpense;
