const { z } = require("zod");
const hireMemberSchema = require("../members/hireMemberSchema");

const createOrganizationSchema = z
  .object({
    name: z
      .string("invalid name")
      .min(1, "name required")
      .transform((value) =>
        value
          .trim()
          .split(/\s+/)
          .map((word) =>
            word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
          )
          .join(" ")
      ),
    description: z
      .string("invalid description")
      .min(20, "description min length is 20")
      .transform((value) => {
        return value.trim()[0].toUpperCase() + value.slice(1);
      }),
    website: z.url("invalid website").optional(),
    email: z.email("invalid email").transform((value) => value.toLowerCase()),
    phone: z
      .string("invalid phone")
      .refine(
        (value) =>
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 11 ||
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 10,
        { error: "invalid phone" }
      ),
    cnpj: z
      .string("invalid cnpj")
      .refine(
        (value) => value.replace(/\s+/g, "").replace(/\D/g, "").length === 14,
        { error: "invalid cnpj" }
      ),
    admin: hireMemberSchema
      .omit({
        role: true,
        organizationId: true,
      })
      .extend({
        password: z
          .string("password required")
          .min(6, "password min length is 6")
          .max(14, "password max length is 14"),
      }),
  })
  .strict();

module.exports = createOrganizationSchema;
