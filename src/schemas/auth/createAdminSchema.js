const { z } = require("zod");

const createAdminSchema = z
  .object({
    name: z
      .string("name required")
      .min(1, "name is required")
      .transform((value) =>
        value
          .trim()
          .split(/\s+/)
          .map((word) =>
            word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
          )
          .join(" ")
      ),
    email: z.email("invalid email").transform((value) => value.toLowerCase()),
    password: z
      .string("password required")
      .min(6, "password min length is 6")
      .max(14, "password max length is 14"),
    phone: z
      .string("phone required")
      .refine(
        (value) =>
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 11 ||
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 10,
        { error: "invalid phone" }
      ),
    document: z.string("document required").refine(
      (value) => {
        return value.replace(/\s+/g, "").replace(/\D/g, "").length === 11;
      },
      { error: "invalid document" }
    ),
  })
  .strict();

module.exports = createAdminSchema;
