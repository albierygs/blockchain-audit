const { z } = require("zod");

const updateDonationSchema = z
  .object({
    status: z
      .enum(["PENDING", "CONFIRMED", "FAILED", "CANCELLED", "REFUNDED"], {
        errorMap: () => ({
          message:
            "invalid satus. Use: PENDING, CONFIRMED, FAILED, CANCELLED ou REFUNDED",
        }),
      })
      .nonoptional("status is required"),
    cancellation_reason: z
      .string("invalid cancellation_reason")
      .max(1000, "cancellation_reason max length is 1000")
      .optional(),
  })
  .strict();

module.exports = updateDonationSchema;
