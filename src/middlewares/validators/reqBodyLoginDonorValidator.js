const { default: z } = require("zod");

const loginDonorSchema = z.object({
  email: z.email("invalid email").transform((value) => value.toLowerCase()),
  password: z.string("password required"),
});

const validateReqBodyLoginDonor = async (req, _res, next) => {
  req.body = loginDonorSchema.parse(req.body);
  next();
};

module.exports = validateReqBodyLoginDonor;
