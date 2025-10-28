const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const updateExpense = async (req, res) => {
  const { id } = req.params; // expense public_id
  const dataToUpdate = req.body;

  // O middleware ORG_EXPENSE_ACTION já garante a permissão

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

  res.status(200).json(updatedExpense);
};

module.exports = updateExpense;
