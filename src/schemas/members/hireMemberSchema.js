const { z } = require("zod");

const hireMemberSchema = z
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
    role: z.enum(["ORG_ADMIN", "AUDITOR", "VOLUNTEER"], {
      error: "invalid role",
    }),
    city: z.string("city required").min(2, "city required"),
    state: z.enum(
      [
        "AC",
        "AL",
        "AP",
        "AM",
        "BA",
        "CE",
        "DF",
        "ES",
        "GO",
        "MA",
        "MT",
        "MS",
        "MG",
        "PA",
        "PB",
        "PR",
        "PE",
        "PI",
        "RJ",
        "RN",
        "RS",
        "RO",
        "RR",
        "SC",
        "SP",
        "SE",
        "TO",
      ],
      { error: "invalide state" }
    ),
    birthDate: z.iso.date("invalid birthDate format (YYYY-MM-DD)"),
    organizationId: z.uuid("invalid organizationId"),
  })
  .strict();

module.exports = hireMemberSchema;
