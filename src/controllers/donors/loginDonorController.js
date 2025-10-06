const ApiException = require("../../exceptions/apiException");
const { DONOR_SECRET_KET_JWT } = require("../../utils/constants");
const { db } = require("../../utils/db");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const loginDonor = async (req, res) => {
  const { email, password } = req.body;

  const donor = await db.donor.findUnique({
    where: { email, status: "ACTIVE" },
  });

  if (!donor) {
    throw new ApiException("email/password incorrect", 401);
  }

  const correctPassword = await bcryptjs.compare(password, donor.password);

  if (!correctPassword) {
    throw new ApiException("email/password incorrect", 401);
  }

  const options = {
    expiresIn: "10m",
  };

  const token = jwt.sign(
    { publicId: donor.public_id },
    DONOR_SECRET_KET_JWT,
    options
  );

  res.status(200).json({
    token,
    created_at: new Date().toLocaleString(),
    duration: "10 minutes",
  });
};

module.exports = loginDonor;
