const { db } = require("../../utils/db");

const listVerifiedOrganizations = async (_req, res) => {
  const organizations = await db.organization.findMany({
    where: {
      verified: true,
      status: "ACTIVE",
    },
    omit: {
      password: true,
      created_at: true,
      updated_at: true,
      status: true,
      id: true,
    },
  });
  res.status(200).json(organizations);
};

module.exports = listVerifiedOrganizations;
