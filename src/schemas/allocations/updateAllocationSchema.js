const { z } = require("zod");

const updateAllocationSchema = z
  .object({
    amount_allocated: z
      .number("amount_allocated must be a number")
      .positive("amount_allocated must be positive")
      .refine(
        (val) =>
          Number(val.toFixed(4)) === val ||
          val.toString().split(".")[1]?.length <= 4,
        { message: "amount_allocated can have a maximum of 4 decimal places" }
      )
      .optional(),
  })
  .strict();

module.exports = updateAllocationSchema;
