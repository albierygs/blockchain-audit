const { db } = require("../../utils/db");

const getDonor = async (req, res) => {
  const donor = await db.donor.findUnique({
    where: {
      public_id: req.userPublicId,
      status: "ACTIVE",
    },
  });

  if (!donor) {
    throw new ApiException("user not found", 404);
  }

  res.status(200).json({
    publicId: donor.public_id,
    name: donor.name,
    email: donor.email,
    phone: donor.phone,
    document: donor.document,
    documentType: donor.document_type,
    createdAt: donor.createdAt,
    updatedAt: donor.updatedAt,
  });
};

module.exports = getDonor;
