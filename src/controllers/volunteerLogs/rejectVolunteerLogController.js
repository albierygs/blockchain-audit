const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const StatusHistoryService = require("../../services/statusHistoryService");

const rejectVolunteerLog = async (req, res) => {
  const { memberId, logId } = req.params;

  // Verificar se o log existe
  const log = await db.volunteer_log.findFirst({
    where: {
      public_id: logId,
      volunteer_id: memberId,
    },
  });

  if (!log) {
    throw new ApiException("volunteer log not found", 404);
  }

  const oldStatus = log.status;
  const newStatus = "REJECTED";

  if (log.status !== "PENDING") {
    throw new ApiException(
      `Can not reject a log with status ${log.status}`,
      400
    );
  }

  // Validar transição de status
  if (
    !StatusHistoryService.isValidStatusTransition(
      "VOLUNTEER_LOG",
      oldStatus,
      newStatus
    )
  ) {
    throw new ApiException(
      `Não é possível alterar de ${oldStatus} para ${newStatus}`,
      400
    );
  }

  // Atualizar o log com status REJECTED
  const updatedLog = await db.volunteer_log.update({
    where: {
      public_id: logId,
    },
    data: {
      status: "REJECTED",
    },
  });

  // Registrar histórico de status
  try {
    await StatusHistoryService.recordStatusChange(
      "VOLUNTEER_LOG",
      logId,
      oldStatus,
      newStatus,
      req.user.publicId,
      "Registro de horas rejeitado",
      {
        project_id: log.project_id,
        hours_worked: log.hours_worked,
      }
    );
  } catch (statusError) {
    console.error(
      "Erro ao registrar status history em rejectVolunteerLog:",
      statusError
    );
  }

  res.status(200).json(updatedLog);
};

module.exports = rejectVolunteerLog;
