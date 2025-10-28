const { db } = require("../../utils/db");

const deleteProject = async (req, res) => {
  const { id } = req.params; // project public_id

  // O middleware ORG_PROJECT_ACTION já garante a permissão

  await db.project.update({
    where: { public_id: id },
    data: {
      deleted_at: new Date(),
    },
  });

  res.status(204).send();
};

module.exports = deleteProject;
