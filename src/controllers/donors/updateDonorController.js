const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const updateDonor = async (req, res) => {
  const { name, email, phone, document, password } = req.body;

  let person = await db.person.findFirst({
    where: {
      status: "ACTIVE",
      role: "DONOR",
      OR: [{ email }, { document }],
      NOT: { public_id: req.user.publicId },
    },
  });

  if (person) {
    throw new ApiException("Email or document already in use", 409);
  }

  person = await db.person.findUnique({
    where: {
      public_id: req.user.publicId,
      status: "ACTIVE",
      role: "DONOR",
    },
  });

  if (!person) {
    throw new ApiException("user not found", 404);
  }

  if (
    req.body.document &&
    req.body.document.length !== person.document.length
  ) {
    throw new ApiException("invalid document", 422);
  }

  const updatedPerson = await db.person.update({
    where: {
      public_id: req.user.publicId,
    },
    data: req.body,
    select: {
      public_id: true,
      name: true,
      email: true,
      document: true,
      phone: true,
      updated_at: true,
      donor: {
        select: {
          document_type: true,
        },
      },
    },
  });

  const response = {
    ...updatedPerson,
    document_type: updatedPerson.donor.document_type,
    donor: undefined,
  };

  res.status(200).json(response);
};

module.exports = updateDonor;
