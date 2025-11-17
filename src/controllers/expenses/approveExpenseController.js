const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const { sendExpenseApprovalEmail } = require("../../utils/emailService");
const StatusHistoryService = require("../../services/statusHistoryService");

const approveExpense = async (req, res) => {
  const { id } = req.params; // expense public_id

  const expense = await db.expense.findUnique({
    where: { public_id: id },
    include: {
      project: true,
    },
  });

  if (!expense) {
    throw new ApiException("Expense not found", 404);
  }

  const oldStatus = expense.status;
  const newStatus = "APPROVED";

  if (expense.status === "APPROVED" || expense.status === "PAID") {
    throw new ApiException("Expense is already approved or paid", 400);
  }

  // Validar transição de status
  if (
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

  // Registrar histórico de status
  try {
    await StatusHistoryService.recordStatusChange(
      "EXPENSE",
      id,
      oldStatus,
      newStatus,
      req.user.publicId,
      "Despesa aprovada",
      {
        name: expense.name,
        value: expense.value,
        category: expense.category,
        project_id: expense.project.public_id,
      }
    );
  } catch (statusError) {
    console.error(
      "Erro ao registrar status history em approveExpense:",
      statusError
    );
  }

  const creator = await db.person.findUnique({
    where: { public_id: expense.created_by },
    select: { email: true },
  });

  if (creator) {
    await sendExpenseApprovalEmail(
      creator.email,
      expense.project.title,
      expense.name
    );
  }

  res.status(200).json(updatedExpense);
};

module.exports = approveExpense;
