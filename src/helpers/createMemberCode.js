const { db } = require("../utils/db");

const generateMemberCode = async () => {
  const characters = "0123456789";
  const charactersLength = characters.length;

  while (true) {
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    const existingMember = await db.organization_member.findUnique({
      where: {
        member_code: result,
      },
    });
    if (!existingMember) {
      return result;
    }
  }
};

module.exports = generateMemberCode;
