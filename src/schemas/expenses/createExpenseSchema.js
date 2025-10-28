const { z } = require("zod");

const createExpenseSchema = z
  .object({
    name: z
      .string("invalid name")
      .min(3, "name min length is 3")
      .max(100, "name max length is 100"),
    description: z
      .string("invalid description")
      .min(10, "description min length is 10"),
    value: z
      .number({ invalid_type_error: "invalid value" })
      .positive("value must be positive"),
    category: z.enum(
      [
        "INFRASTRUCTURE",
        "SUPPLIES",
        "SERVICES",
        "PERSONNEL",
        "MARKETING",
        "ADMINISTRATIVE",
        "OTHER",
      ],
      {
        error: "invalid expense category",
      }
    ),
    payment_date: z.iso
      .date("invalid date format (ISO 8601)")
      .optional()
      .nullable(),
    receipt_url: z.url("invalid receipt url").optional(),
    invoice_number: z.string("invalid invoice number").optional(),
  })
  .strict();

module.exports = createExpenseSchema;
