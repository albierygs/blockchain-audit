const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const getOrganization = async (req, res) => {
  const organization = await db.organization.findUnique({
    where: { public_id: req.params.id, status: "ACTIVE" },
    select: {
      public_id: true,
      name: true,
      description: true,
      website: true,
      email: true,
      phone: true,
      cnpj: true,
      verified: true,
      status: true,
      created_at: true,
      updated_at: true,
      _count: {
        select: {
          allocations: true,
          donations: true,
          projects: true,
          members: true,
        },
      },
    },
  });

  if (!organization) {
    throw new ApiException("organization not found", 404);
  }

  const response = {
    ...organization,
    donations_count: organization._count.donations,
    projects_count: organization._count.projects,
    members_count: organization._count.members,
    allocations_count: organization._count.allocations,
    _count: undefined,
  };

  res.status(200).json(response);
};

module.exports = getOrganization;
