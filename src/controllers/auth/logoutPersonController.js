const { db } = require("../../utils/db");

const logoutPerson = async (req, res) => {
  const authorization = req.headers.authorization;
  const token = authorization.replace("Bearer ", "");

  await db.session.updateMany({
    where: {
      token: token,
      user_id: req.user.publicId,
      revoked: false,
    },
    data: {
      revoked: true,
      revoked_at: new Date(),
    },
  });

  res.status(204).send();
};

module.exports = logoutPerson;
