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

// funções enpecíficas

const sendWelcomeDonorEmail = async (name, email) => {
  const subject = "Bem-vindo(a) à Blockchain Audit API!";
  const html = `
        <p>Olá, <strong>${name}</strong>!</p>
        <p>Agradecemos por se registrar como doador(a) em nossa plataforma. Agora você pode acompanhar a transparência de suas doações em tempo real.</p>
        <p>Seja bem-vindo(a) à nossa comunidade. Sua contribuição é fundamental!</p>
        <br>
        <p>Atenciosamente,<br>A Equipe Blockchain Audit.</p>
    `;
  return sendEmail({ to: email, subject, html });
};

const sendMemberHiredEmail = async (name, email, memberCode, password) => {
  const subject = "Conta de Membro Criada - Acesso ao Sistema";
  const html = `
        <p>Olá, <strong>${name}</strong>!</p>
        <p>Sua conta de membro da organização foi criada com sucesso. Você já pode acessar o sistema utilizando suas credenciais:</p>
        <ul>
            <li><strong>Código de Membro:</strong> <strong>${memberCode}</strong></li>
            <li><strong>Senha Temporária:</strong> ${password}</li>
        </ul>
        <p>Recomendamos que você altere sua senha imediatamente após o primeiro login.</p>
        <br>
        <p>Atenciosamente,<br>A Equipe Blockchain Audit.</p>
    `;

  {
    /* <li>**Senha Temporária:** ${password}</li> */
  }
  return sendEmail({ to: email, subject, html });
};

const sendMemberTerminationEmail = async (
  name,
  email,
  organizationName,
  reason
) => {
  const subject = "Notificação de Encerramento de Membresia";
  const html = `
        <p>Prezado(a) <strong>${name}</strong>,</p>
        <p>Viemos por meio desta notificar o encerramento da sua membresia na organização <strong>${organizationName}</strong>.</p>
        <p>Motivo do Encerramento: <strong>${reason}</strong></p>
        <p>Caso tenha dúvidas, entre em contato com o administrador da sua organização.</p>
        <br>
        <p>Atenciosamente,<br>A Equipe Blockchain Audit.</p>
    `;
  return sendEmail({ to: email, subject, html });
};

const sendOrganizationVerifiedEmail = async (
  organizationName,
  email,
  memberCode
) => {
  const subject = "Sua Organização foi Aprovada!";
  const html = `
        <p>Parabéns, <strong>${organizationName}</strong>!</p>
        <p>Sua organização foi oficialmente aprovada em nossa plataforma. A partir de agora, o administrador já pode acessar a organização, aumentando a confiança e transparência junto aos doadores.</p>
        <p>Credenciais de acesso:</p>
        <ul>
          <li>Código de membro: ${memberCode}</li>
          <li>Senha: Definida no momento do cadastro.</li>
        </ul>
        <p>Obrigado por fazer parte da nossa missão!</p>
        <br>
        <p>Atenciosamente,<br>A Equipe Blockchain Audit.</p>
    `;
  return sendEmail({ to: email, subject, html });
};

const sendPasswordResetEmail = async (to, resetLink) => {
  const subject = "Solicitação de Redefinição de Senha";
  const html = `
        <p>Você solicitou uma redefinição de senha. Clique no link abaixo para redefinir sua senha:</p>
        <a href="${resetLink}">Redefinir Senha</a>
        <p>Este link expirará em 30 minutos. Se você não solicitou esta alteração, por favor, ignore este e-mail.</p>
    `;
  return sendEmail({ to, subject, html });
};

const sendPasswordResetConfirmationEmail = async (email) => {
  const subject = "Sua Senha Foi Alterada com Sucesso";
  const html = `
        <p>Sua senha foi alterada com sucesso.</p>
        <p>Se você não realizou esta alteração, entre em contato imediatamente com o suporte.</p>
        <br>
        <p>Atenciosamente,<br>A Equipe Blockchain Audit.</p>
    `;
  return sendEmail({ to: email, subject, html });
};

const sendExpenseApprovalEmail = async (
  creatorEmail,
  projectName,
  expenseName
) => {
  const subject = "Despesa Aprovada: " + expenseName;
  const html = `
        <p>Prezado(a) Membro,</p>
        <p>A despesa "<strong>${expenseName}</strong>" referente ao projeto "<strong>${projectName}</strong>" foi <strong>APROVADA</strong>.</p>
        <p>Status atual: PENDENTE DE PAGAMENTO</p>
        <br>
        <p>Atenciosamente,<br>A Equipe Blockchain Audit.</p>
    `;
  return sendEmail({ to: creatorEmail, subject, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeDonorEmail,
  sendMemberHiredEmail,
  sendMemberTerminationEmail,
  sendOrganizationVerifiedEmail,
  sendPasswordResetConfirmationEmail,
  sendExpenseApprovalEmail,
};
