const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const createOrganization = async (req, res) => {
  const { name, description, website, email, password, phone, cnpj } = req.body;

  const existingOrg = await db.organization.findFirst({
    where: {
      OR: [{ email }, { cnpj }],
    },
  });

  if (existingOrg) {
    throw new ApiException(
      "Organization already exists with this email or CNPJ",
      409
    );
  }

  const organization = await db.organization.create({
    data: {
      name,
      description,
      website,
      email,
      password,
      phone,
      cnpj,
      status: "ACTIVE",
    },
    select: {
      public_id: true,
      name: true,
      description: true,
      website: true,
      email: true,
      phone: true,
      cnpj: true,
      verified: true,
      created_at: true,
    },
  });

  res.status(200).json(organization);
};

module.exports = createOrganization;
