const ApiException = require("../../exceptions/apiException");
const { db } = require("../../utils/db");

const getDonor = async (req, res) => {
  const person = await db.person.findUnique({
    where: {
      public_id: req.user.publicId,
      status: "ACTIVE",
      role: "DONOR",
    },
    select: {
      public_id: true,
      name: true,
      email: true,
      phone: true,
      document: true,
      created_at: true,
      updated_at: true,
      status: true,
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

  if (!person) {
    throw new ApiException("user not found", 404);
  }

  const response = {
    ...person,
    document_type: person.donor.document_type,
    donor: undefined,
  };

  res.status(200).json(response);
};

module.exports = getDonor;
