const { db } = require("../../utils/db");

const listAllOrganizations = async (_req, res) => {
  const organizations = await db.organization.findMany({
    omit: {
      password: true,
      updated_at: true,
      id: true,
    },
  });
  res.status(200).json(organizations);
};

module.exports = listAllOrganizations;
