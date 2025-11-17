const { db } = require("../../utils/db");
const StatusHistoryService = require("../../services/statusHistoryService");

const createProject = async (req, res) => {
  const organizationId = req.params.id;

  const { title, description, goal_amount, start_date, end_date } = req.body;

  const project = await db.project.create({
    data: {
      organization_id: organizationId,
      title,
      description,
      goal_amount: goal_amount,
      start_date: new Date(start_date),
      end_date: end_date ? new Date(end_date) : null,
      status: "DRAFT",
    },
    select: {
      public_id: true,
      title: true,
      organization_id: true,
      goal_amount: true,
      collected_amount: true,
      status: true,
      created_at: true,
    },
  });

  // Registrar automaticamente no status_history
  try {
    await StatusHistoryService.recordStatusChange(
      "PROJECT",
      project.public_id,
      null,
      "DRAFT",
      req.user.publicId,
      "Projeto criado",
      {
        title,
        goal_amount,
        organization_id: organizationId,
      }
    );
  } catch (statusError) {
    console.error("Erro ao registrar status history:", statusError);
  }

  res.status(201).json(project);
};

module.exports = createProject;
