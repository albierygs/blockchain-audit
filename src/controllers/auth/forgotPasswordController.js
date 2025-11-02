const { db } = require("../../utils/db");
const crypto = require("crypto");
const {
  FORGOT_TOKEN_EXPIRATION_MINUTES,
  FRONTEND_URL,
} = require("../../utils/constants");
const { sendPasswordResetEmail } = require("../../utils/emailService");

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const person = await db.person.findUnique({
    where: {
      email,
      status: "ACTIVE",
    },
    select: {
      public_id: true,
      email: true,
    },
  });

  // retorna sucesso mesmo que o email não exista.
  if (!person) {
    console.warn(`Forgot password request for unknown email: ${email}`);
    return res.status(200).json({
      message:
        "If the email is registered, a password reset link has been sent.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date();
  expiresAt.setMinutes(
    expiresAt.getMinutes() + FORGOT_TOKEN_EXPIRATION_MINUTES
  );

  await db.$transaction(async (tx) => {
    // Invalida tokens de reset de senha antigos e não usados para este usuário
    await tx.password_reset_token.updateMany({
      where: {
        user_id: person.public_id,
        used: false,
        expires_at: { gt: new Date() },
      },
      data: {
        used: true,
      },
    });

    await tx.password_reset_token.create({
      data: {
        token: token,
        user_id: person.public_id,
        expires_at: expiresAt,
      },
    });
  });

  const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

  await sendPasswordResetEmail(person.email, resetLink);

  res.status(200).json({
    message: "If the email is registered, a password reset link has been sent.",
  });
};

module.exports = forgotPassword;
