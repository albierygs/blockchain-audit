const { default: z } = require("zod");

const updateDonorSchema = z
  .object({
    name: z
      .string("invalid name")
      .transform((value) =>
        value
          .trim()
          .split(/\s+/)
          .map((word) =>
            word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ""
          )
          .join(" ")
      )
      .optional(),
    email: z
      .email("invalid email")
      .transform((value) => value.toLowerCase())
      .optional(),
    phone: z
      .string("invalid phone")
      .refine(
        (value) => value.replace(/\s+/g, "").replace(/\D/g, "").length === 11,
        { error: "invalid phone" }
      )
      .optional(),
    document: z
      .string("invalid document")
      .refine(
        (value) => {
          return (
            value.replace(/\s+/g, "").replace(/\D/g, "").length === 11 ||
            value.replace(/\s+/g, "").replace(/\D/g, "").length === 14
          );
        },
        { error: "invalid document" }
      )
      .optional(),
  })
  .strict();

const validateReqBodyUpdateDonor = async (req, res, next) => {
  req.body = updateDonorSchema.parse(req.body);
  next();
};

module.exports = validateReqBodyUpdateDonor;
