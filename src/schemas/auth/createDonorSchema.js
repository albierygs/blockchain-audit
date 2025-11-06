const { z } = require("zod");

const createDonorSchema = z
  .object({
    name: z.string("name required").min(1, "name is required"),
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
        return (
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 11 ||
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 14
        );
      },
      { error: "invalid document" }
    ),
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
  })
  .strict();

module.exports = createDonorSchema;
