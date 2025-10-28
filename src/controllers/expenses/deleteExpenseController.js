const { db } = require("../../utils/db");

const deleteExpense = async (req, res) => {
  const { id } = req.params; // expense public_id

  await db.expense.update({
    where: { public_id: id },
    data: {
      deleted_at: new Date(),
    },
  });

  res.status(204).send();
};

module.exports = deleteExpense;
