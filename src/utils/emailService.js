const nodemailer = require("nodemailer");
const {
  EMAIL_SERVICE,
  EMAIL_USER,
  EMAIL_PASSWORD,
  FORGOT_TOKEN_EXPIRATION_MINUTES,
} = require("./constants");

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
  // Opcional: Para desenvolvimento ou serviços que não usam SSL/TLS
  // tls: {
  //   rejectUnauthorized: false,
  // },
});

const sendEmail = async ({ to, subject, html, text }) => {
  if (!to || !subject || (!html && !text)) {
    throw new ApiException(
      "Email options missing: to, subject, or content (html/text).",
      500
    );
  }

  const mailOptions = {
    from: EMAIL_USER,
    to: to,
    subject: subject,
    html: html,
    text: text,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`Email sent to ${to}. Message ID: ${info.messageId}`);
  return info;
};

const sendPasswordResetEmail = async (to, resetLink) => {
  const subject = "Password Reset Request";
  const html = `
    <p>You requested a password reset. Click the link below to reset your password:</p>
    <a href="${resetLink}">Reset Password</a>
    <p>This link will expire in 30 minutes. If you did not request this, please ignore this email.</p>
  `;

  return sendEmail({ to, subject, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};
