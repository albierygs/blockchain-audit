const { z } = require("zod");

const resetPasswordSchema = z
  .object({
    token: z.string("token required").min(1, "token is required"),
    password: z
      .string("password required")
      .min(6, "password min length is 6")
      .max(14, "password max length is 14"),
  })
  .strict();

module.exports = resetPasswordSchema;
