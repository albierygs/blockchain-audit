const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const { sendOrganizationVerifiedEmail } = require("../../utils/emailService");

const verifyOrganization = async (req, res) => {
  const existingOrganization = await db.organization.findUnique({
    where: {
      public_id: req.params.id,
    },
  });

  if (!existingOrganization) {
    throw new ApiException("Organization not found", 404);
  }

  if (existingOrganization.verified) {
    throw new ApiException("Organization is already verified", 400);
  }

  await db.organization.update({
    where: {
      public_id: req.params.id,
    },
    data: {
      verified: true,
      verified_at: new Date(),
      verified_by: req.user.publicId,
    },
  });

  await sendOrganizationVerifiedEmail(
    existingOrganization.name,
    existingOrganization.email
  );

  res.status(204).send();
};

module.exports = verifyOrganization;
