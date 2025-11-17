const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");
const { sendWelcomeDonorEmail } = require("../../utils/emailService");
const StatusHistoryService = require("../../services/statusHistoryService");

const createDonor = async (req, res) => {
  const { name, email, phone, document, password, city, state, birthDate } =
    req.body;

  const person = await db.person.findFirst({
    where: {
      OR: [{ email }, { document }],
    },
  });

  if (person) {
    throw new ApiException("email/document already been used", 409);
  }

  const passwordHash = await bcrypt.hash(password, SALT_BCRYPT);

  const personCreated = await db.person.create({
    data: {
      document,
      email,
      name,
      password: passwordHash,
      phone,
      role: "DONOR",
      city,
      state,
      birth_date: birthDate,
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
      city: true,
      state: true,
      birth_date: true,
      donor: {
        select: {
          document_type: true,
        },
      },
    },
  });

  try {
    await StatusHistoryService.recordStatusChange(
      "PERSON",
      personCreated.public_id,
      null,
      "ACTIVE",
      personCreated.public_id, // O próprio doador (user_id é o changed_by)
      "Conta de doador criada e ativada",
      {
        role: "DONOR",
        document_type: personCreated.donor.document_type,
      }
    );
  } catch (statusError) {
    console.error(
      "Erro ao registrar status history na criação de doador:",
      statusError
    );
  }

  await sendWelcomeDonorEmail(personCreated.name, personCreated.email);

  const response = {
    ...personCreated,
    document_type: personCreated.donor.document_type,
    donor: undefined,
  };

  res.status(200).json(response);
};

module.exports = createDonor;
