const { default: z } = require("zod");

const loginSchema = z.union([
  z
    .object({
      email: z.email("invalid email").transform((value) => value.toLowerCase()),
      password: z.string("password required"),
    })
    .strict(),
  z
    .object({
      memberCode: z.string("code required"),
      password: z.string("password required"),
    })
    .strict(),
]);

module.exports = loginSchema;
