const { db } = require("../../utils/db");

const updateProject = async (req, res) => {
  const { id } = req.params; // project public_id
  const dataToUpdate = req.body;

  // O middleware ORG_PROJECT_ACTION já garante a permissão

  const updatedProject = await db.project.update({
    where: { public_id: id },
    data: {
      ...dataToUpdate,
      start_date: dataToUpdate.start_date
        ? new Date(dataToUpdate.start_date)
        : undefined,
      end_date: dataToUpdate.end_date
        ? new Date(dataToUpdate.end_date)
        : undefined,
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
      updated_at: true,
    },
  });

  res.status(200).json(updatedProject);
};

module.exports = updateProject;
