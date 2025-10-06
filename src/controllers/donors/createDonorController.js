const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");
const { nanoid } = require("nanoid");

const createDonor = async (req, res) => {
  const { name, email, phone, document, password } = req.body;

  const donorExists = await db.donor.findUnique({
    where: {
      email,
      document,
    },
  });

  if (donorExists) {
    throw new ApiException("email/document already been used", 409);
  }

  const passwordHash = await bcrypt.hash(password, Number(SALT_BCRYPT));

  let publicId;
  while (true) {
    publicId = nanoid(16);
    const exists = await db.donor.findUnique({
      where: {
        public_id: publicId,
      },
    });
    if (!exists) {
      break;
    }
  }

  const donor = await db.donor.create({
    data: {
      public_id: publicId,
      document,
      email,
      name,
      password: passwordHash,
      phone,
      document_type: document.length === 11 ? "CPF" : "CNPJ",
      status: "ACTIVE",
    },
  });

  res.status(200).json({
    publicId: donor.public_id,
    name: donor.name,
    email: donor.email,
    phone: donor.phone,
    document: donor.document,
    documentType: donor.document_type,
    createdAt: donor.createdAt,
  });
};

module.exports = createDonor;
