const ApiException = require("../../exceptions/apiException");
const { db } = require("../../utils/db");

const deleteDonor = async (req, res) => {
  const donor = await db.donor.findUnique({
    where: {
      public_id: req.userPublicId,
      status: "ACTIVE",
    },
  });

  if (!donor) {
    throw new ApiException("user not found", 404);
  }

  await db.donor.update({
    where: {
      public_id: req.userPublicId,
    },
    data: {
      status: "INACTIVE",
    },
  });

  res.status(201).send();
};

module.exports = deleteDonor;
