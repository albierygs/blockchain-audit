const { z } = require("zod");

const forgotPasswordSchema = z
  .object({
    email: z.email("invalid email").transform((value) => value.toLowerCase()),
  })
  .strict();

module.exports = forgotPasswordSchema;
