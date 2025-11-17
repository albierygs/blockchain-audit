const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const StatusHistoryService = require("../../services/statusHistoryService");

const approveVolunteerLog = async (req, res) => {
  const { memberId, logId } = req.params;
  const approverPublicId = req.user.publicId; // Obtém o ID do usuário autenticado

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
  const newStatus = "APPROVED";

  if (log.status !== "PENDING") {
    throw new ApiException(
      `Can not aprrove a log with status ${log.status}`,
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

  // Atualizar o log com status APPROVED
  const updatedLog = await db.volunteer_log.update({
    where: {
      public_id: logId,
    },
    data: {
      status: "APPROVED",
      approved_by_id: approverPublicId,
    },
    include: {
      project: {
        select: {
          title: true,
          public_id: true,
        },
      },
      approved_by: {
        select: {
          person: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  // Registrar histórico de status
  try {
    await StatusHistoryService.recordStatusChange(
      "VOLUNTEER_LOG",
      logId,
      oldStatus,
      newStatus,
      approverPublicId,
      "Registro de horas aprovado",
      {
        project_id: log.project_id,
        hours_worked: log.hours_worked,
      }
    );
  } catch (statusError) {
    console.error(
      "Erro ao registrar status history em approveVolunteerLog:",
      statusError
    );
  }

  res.status(200).json(updatedLog);
};

module.exports = approveVolunteerLog;
