const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const updateDonor = async (req, res) => {
  const donor = await db.donor.findUnique({
    where: {
      public_id: req.userPublicId,
      status: "ACTIVE",
    },
  });

  if (!donor) {
    throw new ApiException("user not found", 404);
  }

  if (req.body.document && req.body.document.length !== donor.document.length) {
    throw new ApiException("invalid document", 422);
  }

  const updatedDonor = await db.donor.update({
    where: {
      public_id: req.userPublicId,
    },
    data: req.body,
  });

  res.status(200).json({
    publicId: updatedDonor.public_id,
    name: updatedDonor.name,
    email: updatedDonor.email,
    document: updatedDonor.document,
    documentType: updatedDonor.document_type,
    phone: updatedDonor.phone,
    updatedAt: updatedDonor.updatedAt,
  });
};

module.exports = updateDonor;
