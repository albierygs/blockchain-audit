const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const approveExpense = async (req, res) => {
  const { id } = req.params; // expense public_id

  const expense = await db.expense.findUnique({
    where: { public_id: id },
  });

  if (!expense) {
    throw new ApiException("Expense not found", 404);
  }

  if (expense.status === "APPROVED" || expense.status === "PAID") {
    throw new ApiException("Expense is already approved or paid", 400);
  }

  const updatedExpense = await db.expense.update({
    where: { public_id: id },
    data: {
      status: "APPROVED",
      approved_by: req.user.publicId,
      approved_at: new Date(),
    },
    select: {
      public_id: true,
      status: true,
      approved_by: true,
      approved_at: true,
    },
  });

  res.status(200).json(updatedExpense);
};

module.exports = approveExpense;
