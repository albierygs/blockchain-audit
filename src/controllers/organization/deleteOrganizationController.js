const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const deleteOrganization = async (req, res) => {
  const { id } = req.params;

  const existingOrganization = await db.organization.findUnique({
    where: { public_id: id, status: "ACTIVE" },
  });

  if (!existingOrganization) {
    throw new ApiException("Organization not found", 404);
  }

  await db.organization.update({
    where: { public_id: id },
    data: { status: "INACTIVE" },
  });

  res.status(204).send();
};

module.exports = deleteOrganization;
