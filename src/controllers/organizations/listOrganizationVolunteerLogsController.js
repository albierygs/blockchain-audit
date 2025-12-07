const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const listOrganizationVolunteerLogs = async (req, res) => {
  const { organizationId } = req.params;

  // Verificar se organização existe
  const organization = await db.organization.findUnique({
    where: {
      public_id: organizationId,
    },
    select: {
      public_id: true,
      name: true,
    },
  });

  if (!organization) {
    throw new ApiException("Organização não encontrada", 404);
  }

  // Construir filtros
  const where = {
    volunteer: {
      organization_id: organizationId,
    },
  };

  // Buscar volunteer logs
  const logs = await db.volunteer_log.findMany({
    where,
    include: {
      volunteer: {
        select: {
          public_id: true,
          person: {
            select: {
              public_id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      project: {
        select: {
          public_id: true,
          title: true,
        },
      },
      approved_by: {
        select: {
          public_id: true,
          person: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  // Formatar resposta
  const formattedLogs = logs.map((log) => ({
    public_id: log.public_id,
    volunteer: log.volunteer,
    project: log.project,
    date: log.date,
    hours_worked: log.hours_worked,
    description: log.description,
    status: log.status,
    approved_by: log.approved_by,
    approved_at: log.approved_at,
    rejection_reason: log.rejection_reason,
    created_at: log.created_at,
    updated_at: log.updated_at,
  }));

  res.status(200).json({
    organization,
    logs: formattedLogs,
  });
};

module.exports = listOrganizationVolunteerLogs;
