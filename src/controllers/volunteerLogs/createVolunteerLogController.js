const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const StatusHistoryService = require("../../services/statusHistoryService");

const createVolunteerLog = async (req, res) => {
  const { memberId } = req.params;
  const { project_id, hours_worked, description } = req.body;

  // Verificar se o membro existe
  const member = await db.organization_member.findUnique({
    where: {
      public_id: memberId,
      status: "ACTIVE",
    },
  });

  if (!member) {
    throw new ApiException("Member not found", 404);
  }

  // Verificar se o projeto existe (se fornecido)
  if (project_id) {
    const project = await db.project.findUnique({
      where: {
        public_id: project_id,
      },
    });

    if (!project) {
      throw new ApiException("Project not found", 404);
    }
  }

  // Criar o novo registro de hora voluntária
  const newLog = await db.volunteer_log.create({
    data: {
      volunteer_id: memberId,
      project_id,
      hours_worked: parseFloat(hours_worked),
      description,
      status: "PENDING", // Padrão: PENDING
    },
    include: {
      project: {
        select: {
          title: true,
          public_id: true,
        },
      },
    },
  });

  // Registrar histórico de status
  try {
    await StatusHistoryService.recordStatusChange(
      "VOLUNTEER_LOG",
      newLog.public_id,
      null,
      "PENDING",
      memberId, // O voluntário é quem cria o log
      "Registro de horas criado",
      {
        project_id: project_id,
        hours_worked: parseFloat(hours_worked),
      }
    );
  } catch (statusError) {
    console.error(
      "Erro ao registrar status history em createVolunteerLog:",
      statusError
    );
  }

  res.status(201).json(newLog);
};

module.exports = createVolunteerLog;
