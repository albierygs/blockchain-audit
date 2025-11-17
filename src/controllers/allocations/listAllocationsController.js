const { db } = require("../../utils/db");

const listAllocations = async (req, res) => {
  const { donationId, projectId, organizationId, startDate, endDate } =
    req.query;

  // Construir o filtro dinamicamente
  const where = {};

  if (donationId) {
    where.donation_id = donationId;
  }

  if (projectId) {
    where.project_id = projectId;
  }

  if (organizationId) {
    where.organizationId = organizationId;
  }

  if (startDate || endDate) {
    where.allocation_date = {};
    if (startDate) {
      where.allocation_date.gte = new Date(startDate);
    }
    if (endDate) {
      where.allocation_date.lte = new Date(endDate);
    }
  }

  const allocations = await db.allocation.findMany({
    where,
    include: {
      donation: {
        select: {
          public_id: true,
          value: true,
          status: true,
          donor: {
            select: {
              person: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      project: {
        select: {
          public_id: true,
          title: true,
          status: true,
        },
      },
      organization: {
        select: {
          public_id: true,
          name: true,
        },
      },
      blockchain_transaction: {
        select: {
          hash: true,
          status: true,
          network: true,
        },
      },
    },
    orderBy: {
      allocation_date: "desc",
    },
  });

  res.status(200).json(allocations);
};

module.exports = listAllocations;
