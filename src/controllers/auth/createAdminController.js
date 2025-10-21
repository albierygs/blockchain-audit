const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");

const createAdmin = async (req, res) => {
  const { name, email, phone, document, password } = req.body;

  const person = await db.person.findFirst({
    where: {
      OR: [{ email }, { document }],
      role: "ADMIN",
    },
  });

  if (person) {
    throw new ApiException("email/document already been used", 409);
  }

  const passwordHash = await bcrypt.hash(password, Number(SALT_BCRYPT));

  const admin = await db.person.create({
    data: {
      document,
      email,
      name,
      password: passwordHash,
      phone,
      status: "ACTIVE",
      role: "ADMIN",
    },
    select: {
      public_id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      document: true,
      created_at: true,
    },
  });

  res.status(200).json(admin);
};

module.exports = createAdmin;
