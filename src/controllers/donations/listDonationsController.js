const { db } = require("../../utils/db");

const listDonations = async (req, res) => {
  const { status, donorId, organizationId, startDate, endDate } = req.query;

  // Construir o filtro dinamicamente
  const where = {};

  if (status) {
    where.status = status.toUpperCase();
  }

  if (donorId) {
    where.donor_id = donorId;
  }

  if (organizationId) {
    where.organization_id = organizationId;
  }

  if (startDate || endDate) {
    where.date = {};
    if (startDate) {
      where.date.gte = new Date(startDate);
    }
    if (endDate) {
      where.date.lte = new Date(endDate);
    }
  }

  const donations = await db.donation.findMany({
    where,
    include: {
      donor: {
        select: {
          person: {
            select: {
              name: true,
              public_id: true,
              email: true,
            },
          },
        },
      },
      organization: {
        select: {
          name: true,
          public_id: true,
          email: true,
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
      date: "desc",
    },
  });

  res.status(200).json(donations);
};

module.exports = listDonations;
