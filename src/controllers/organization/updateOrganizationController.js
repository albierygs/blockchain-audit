const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const updateOrganization = async (req, res) => {
  const { id } = req.params;
  const { name, description, website, email, password, phone, cnpj } = req.body;

  let existingOrg = await db.organization.findFirst({
    where: {
      OR: [{ email }, { cnpj }],
      NOT: {
        public_id: id,
      },
      status: "ACTIVE",
    },
  });

  if (existingOrg) {
    throw new ApiException(
      "Email or CNPJ already in use by another organization",
      409
    );
  }

  existingOrg = await db.organization.findUnique({
    where: {
      public_id: id,
      status: "ACTIVE",
    },
  });

  if (!existingOrg) {
    throw new ApiException("Organization not found", 404);
  }

  const organization = await db.organization.update({
    where: { public_id: id },
    data: {
      name,
      description,
      website,
      email,
      password,
      phone,
      cnpj,
    },
    select: {
      public_id: true,
      name: true,
      description: true,
      website: true,
      email: true,
      phone: true,
      cnpj: true,
      updated_at: true,
      verified: true,
    },
  });

  res.status(200).json(organization);
};

module.exports = updateOrganization;
