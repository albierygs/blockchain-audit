const { db } = require("../../utils/db");
const StatusHistoryService = require("../../services/statusHistoryService");

const updateProject = async (req, res) => {
  const { id } = req.params; // project public_id
  const dataToUpdate = req.body;

  // Buscar projeto original para obter o status atual
  const originalProject = await db.project.findUnique({
    where: { public_id: id },
    select: { status: true },
  });

  const oldStatus = originalProject?.status;
  const newStatus = dataToUpdate.status;

  const updatedProject = await db.project.update({
    where: { public_id: id },
    data: {
      ...dataToUpdate,
      start_date: dataToUpdate.start_date
        ? new Date(dataToUpdate.start_date)
        : undefined,
      end_date: dataToUpdate.end_date
        ? new Date(dataToUpdate.end_date)
        : undefined,
    },
    select: {
      public_id: true,
      organization_id: true,
      title: true,
      description: true,
      goal_amount: true,
      collected_amount: true,
      start_date: true,
      end_date: true,
      status: true,
      updated_at: true,
    },
  });

  // Registrar histórico de status se o status foi alterado
  if (newStatus && oldStatus) {
    try {
      await StatusHistoryService.recordStatusChange(
        "PROJECT",
        id,
        oldStatus,
        newStatus,
        req.user.publicId,
        `Status do projeto alterado para ${newStatus}`,
        {
          title: updatedProject.title,
          goal_amount: updatedProject.goal_amount,
        }
      );
    } catch (statusError) {
      console.error(
        "Erro ao registrar status history em updateProject:",
        statusError
      );
    }
  }

  res.status(200).json(updatedProject);
};

module.exports = updateProject;
