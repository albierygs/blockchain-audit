const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const createExpense = async (req, res) => {
  const projectId = req.params.id; // project public_id validado por ORG_PROJECT_ACCESS/ACTION

  const {
    name,
    description,
    value,
    category,
    payment_date,
    receipt_url,
    invoice_number,
  } = req.body;

  // O middleware garante que o usuário tem acesso ao projeto.
  // Verificamos a existência do projeto para robustez.
  const project = await db.project.findUnique({
    where: { public_id: projectId, deleted_at: null },
    include: {
      expenses: {
        select: {
          value,
        },
      },
    },
  });

  if (!project) {
    throw new ApiException("Project not found", 404);
  }

  const expense = await db.expense.create({
    data: {
      project_id: projectId,
      name,
      description,
      value,
      category,
      payment_date: payment_date ? new Date(payment_date) : null,
      receipt_url,
      invoice_number,
      created_by: req.user.publicId, // Quem está logado
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

  res.status(201).json(expense);
};

module.exports = createExpense;
