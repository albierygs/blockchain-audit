const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const bcrypt = require("bcryptjs");
const { SALT_BCRYPT } = require("../../utils/constants");
const {
  sendPasswordResetConfirmationEmail,
} = require("../../utils/emailService");

const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let resetToken;

  await db.$transaction(async (tx) => {
    resetToken = await tx.password_reset_token.findUnique({
      where: {
        token: token,
      },
      include: {
        person: true,
      },
    });

    if (!resetToken || resetToken.used || new Date() > resetToken.expires_at) {
      throw new ApiException("Invalid, expired, or used reset token", 400);
    }

    const passwordHash = await bcrypt.hash(password, SALT_BCRYPT);

    await tx.person.update({
      where: {
        public_id: resetToken.user_id,
      },
      data: {
        password: passwordHash,
      },
    });

    await tx.password_reset_token.update({
      where: {
        id: resetToken.id,
      },
      data: {
        used: true,
      },
    });

    await tx.session.updateMany({
      where: {
        user_id: resetToken.user_id,
        revoked: false,
      },
      data: {
        revoked: true,
        revoked_at: new Date(),
      },
    });
  });

  if (resetToken) {
    await sendPasswordResetConfirmationEmail(resetToken.person.email);
  }

  res.status(200).json({
    message: "Password successfully reset.",
  });
};

module.exports = resetPassword;
