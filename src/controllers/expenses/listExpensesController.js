const { db } = require("../../utils/db");

const listExpenses = async (req, res) => {
  const projectId = req.params.id;

  const expenses = await db.expense.findMany({
    where: {
      project_id: projectId,
    },
    select: {
      public_id: true,
      project_id: true,
      name: true,
      value: true,
      category: true,
      status: true,
      payment_date: true,
      created_at: true,
      created_by: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  res.status(200).json(expenses);
};

module.exports = listExpenses;
