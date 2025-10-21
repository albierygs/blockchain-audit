const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");

const createDonor = async (req, res) => {
  const { name, email, phone, document, password } = req.body;

  const person = await db.person.findFirst({
    where: {
      OR: [{ email }, { document }],
      role: "DONOR",
    },
  });

  if (person) {
    throw new ApiException("email/document already been used", 409);
  }

  const passwordHash = await bcrypt.hash(password, Number(SALT_BCRYPT));

  const personCreated = await db.person.create({
    data: {
      document,
      email,
      name,
      password: passwordHash,
      phone,
      status: "ACTIVE",
      role: "DONOR",
      donor: {
        create: {
          document_type: document.length === 11 ? "CPF" : "CNPJ",
        },
      },
    },
    select: {
      public_id: true,
      name: true,
      email: true,
      phone: true,
      document: true,
      role: true,
      created_at: true,
      donor: {
        select: {
          document_type: true,
        },
      },
    },
  });

  const response = {
    ...personCreated,
    document_type: personCreated.donor.document_type,
    donor: undefined,
  };

  res.status(200).json(response);
};

module.exports = createDonor;
