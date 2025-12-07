const { db } = require("../../utils/db");

const listAllVolunteerLogs = async (_req, res) => {
  // Buscar volunteer logs
  const logs = await db.volunteer_log.findMany({
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
          organization: {
            select: {
              public_id: true,
              name: true,
            },
          },
        },
      },
      project: {
        select: {
          public_id: true,
          title: true,
          organization_id: true,
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

  res.status(200).json(formattedLogs);
};

module.exports = listAllVolunteerLogs;
