const { default: z } = require("zod");

const updateDonorSchema = z
  .object({
    name: z.string("invalid name").transform((value) =>
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
      .string("invalid phone")
      .refine(
        (value) =>
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 11 ||
          value.replace(/\s+/g, "").replace(/\D/g, "").length === 10,
        { error: "invalid phone" }
      ),
    document: z.string("invalid document").refine(
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
  .partial()
  .strict();

module.exports = updateDonorSchema;
