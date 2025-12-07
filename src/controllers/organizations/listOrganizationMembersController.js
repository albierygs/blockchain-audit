const { db } = require("../../utils/db");
const ApiException = require("../../exceptions/apiException");

const listOrganizationMembers = async (req, res) => {
  const { organizationId } = req.params;

  // Verificar se organização existe
  const organization = await db.organization.findUnique({
    where: {
      public_id: organizationId,
    },
    select: {
      public_id: true,
      name: true,
    },
  });

  if (!organization) {
    throw new ApiException("Organização não encontrada", 404);
  }

  // Construir filtros
  const where = {
    organization_id: organizationId,
  };

  // Buscar total de registros
  const total = await db.organization_member.count({
    where,
  });

  // Buscar membros
  const members = await db.organization_member.findMany({
    where,
    include: {
      person: {
        select: {
          public_id: true,
          name: true,
          email: true,
          phone: true,
          document: true,
          status: true,
          created_at: true,
        },
      },
      memberships: {
        select: {
          public_id: true,
          role: true,
          status: true,
          hired_at: true,
          terminated_at: true,
        },
        orderBy: {
          hired_at: "desc",
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  // Formatar resposta
  const formattedMembers = members.map((member) => ({
    public_id: member.public_id,
    member_code: member.member_code,
    person: member.person,
    role: member.role,
    status: member.status,
    memberships: member.memberships,
    created_at: member.created_at,
    updated_at: member.updated_at,
  }));

  res.status(200).json({
    organization,
    members: formattedMembers,
  });
};

module.exports = listOrganizationMembers;
