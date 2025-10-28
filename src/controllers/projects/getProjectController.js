const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const getProject = async (req, res) => {
  const { id } = req.params;

  const project = await db.project.findUnique({
    where: {
      public_id: id,
    },
    select: {
      public_id: true,
      organization_id: true,
      title: true,
      description: true,
      goal_amount: true,
      collected_amount: true,
      start_date: true,
      end_date: true,
      status: true,
      created_at: true,
      updated_at: true,
      organization: {
        select: {
          name: true,
          public_id: true,
        },
      },
    },
  });

  if (!project) {
    throw new ApiException("Project not found", 404);
  }

  const response = {
    ...project,
    organization_name: project.organization.name,
    organization: undefined,
  };

  res.status(200).json(response);
};

module.exports = getProject;
