const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");
const generateMemberCode = require("../../helpers/createMemberCode");
const bcrypt = require("bcryptjs");

const createOrganization = async (req, res) => {
  const { name, description, website, email, phone, cnpj, admin } = req.body;

  // Verificar se organização já existe
  const existingOrg = await db.organization.findFirst({
    where: {
      OR: [{ email }, { cnpj }],
    },
  });

  if (existingOrg) {
    throw new ApiException("Organização já existe com este email ou CNPJ", 409);
  }

  // Verificar se email do admin já existe
  const existingAdminPerson = await db.person.findFirst({
    where: {
      OR: [{ email: admin.email }, { document: admin.document }],
    },
  });

  if (existingAdminPerson) {
    throw new ApiException(
      "Já existe uma pessoa registrada com este email ou documento",
      409
    );
  }

  // Executar tudo em uma transação
  const result = await db.$transaction(async (tx) => {
    // 1. Criar a organização
    const organization = await tx.organization.create({
      data: {
        name,
        description,
        website,
        email,
        phone,
        cnpj,
        password: "123456", // Será definido após aprovação
        status: "ACTIVE",
        verified: false,
      },
      select: {
        public_id: true,
        name: true,
        description: true,
        website: true,
        email: true,
        phone: true,
        cnpj: true,
        verified: true,
        created_at: true,
      },
    });

    // 2. Criar a pessoa (admin)
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const adminPerson = await tx.person.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: hashedPassword,
        phone: admin.phone,
        document: admin.document,
        city: admin.city,
        state: admin.state,
        birth_date: new Date(admin.birthDate),
        status: "ACTIVE",
        role: "ORG_MEMBER",
      },
      select: {
        public_id: true,
        name: true,
        email: true,
        phone: true,
        document: true,
      },
    });

    const memberCode = await generateMemberCode();

    // 3. Criar o membro da organização (organization_member)
    const organizationMember = await tx.organization_member.create({
      data: {
        public_id: adminPerson.public_id,
        role: "ORG_ADMIN",
        status: "SUSPENDED", // Suspenso até a verificação da organização
        organization_id: organization.public_id,
        member_code: memberCode,
      },
      select: {
        public_id: true,
        role: true,
        status: true,
      },
    });

    // 4. Criar membership (organization_membership)
    const membership = await tx.organization_membership.create({
      data: {
        member_id: adminPerson.public_id,
        organization_id: organization.public_id,
        role: "ORG_ADMIN",
        status: "SUSPENDED", // Suspenso até a verificação da organização
        hired_by_id: adminPerson.public_id, // O admin se contrata a si mesmo
      },
      select: {
        public_id: true,
        role: true,
        status: true,
        hired_at: true,
      },
    });

    return {
      organization,
      admin: {
        ...adminPerson,
        role: organizationMember.role,
        status: organizationMember.status,
      },
      membership,
    };
  });

  res.status(201).json({
    message: "Organização criada com sucesso. Aguardando aprovação.",
    organization: result.organization,
    admin: result.admin,
    membership: result.membership,
    note: "Após a aprovação da organização, um email será enviado com as instruções de acesso.",
  });
};

module.exports = createOrganization;
