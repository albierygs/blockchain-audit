const { db } = require("../../utils/db");

const createProject = async (req, res) => {
  const organizationId = req.params.id;

  const { title, description, goal_amount, start_date, end_date } = req.body;

  const project = await db.project.create({
    data: {
      organization_id: organizationId,
      title,
      description,
      goal_amount: goal_amount,
      start_date: new Date(start_date),
      end_date: end_date ? new Date(end_date) : null,
      status: "DRAFT", // Status inicial padrão
    },
    select: {
      public_id: true,
      title: true,
      organization_id: true,
      goal_amount: true,
      collected_amount: true,
      status: true,
      created_at: true,
    },
  });

  res.status(201).json(project);
};

module.exports = createProject;
