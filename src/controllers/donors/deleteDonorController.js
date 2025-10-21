const ApiException = require("../../exceptions/apiException");
const { db } = require("../../utils/db");

const deleteDonor = async (req, res) => {
  const person = await db.person.findUnique({
    where: {
      public_id: req.user.publicId,
      status: "ACTIVE",
      role: "DONOR",
    },
  });

  if (!person) {
    throw new ApiException("user not found", 404);
  }

  await db.person.update({
    where: {
      public_id: req.user.publicId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  res.status(204).send();
};

module.exports = deleteDonor;
