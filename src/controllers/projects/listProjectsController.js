const { db } = require("../../utils/db");

const listProjects = async (req, res) => {
  const organizationId = req.params.id;

  const projects = await db.project.findMany({
    where: {
      organization_id: organizationId,
    },
    select: {
      public_id: true,
      title: true,
      description: true,
      goal_amount: true,
      collected_amount: true,
      start_date: true,
      end_date: true,
      status: true,
      created_at: true,
      updated_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  res.status(200).json(projects);
};

module.exports = listProjects;
