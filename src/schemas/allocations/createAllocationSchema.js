const { z } = require("zod");

const createAllocationSchema = z
  .object({
    donation_id: z
      .uuid("donation_id must be a valid UUID")
      .nonoptional("donation_id is required"),
    project_id: z
      .uuid("project_id must be a valid UUID")
      .nonoptional("project_id is required"),
    amount_allocated: z
      .number("amount_allocated must be a number")
      .positive("amount_allocated must be positive")
      .refine(
        (val) =>
          Number(val.toFixed(4)) === val ||
          val.toString().split(".")[1]?.length <= 4,
        { message: "amount_allocated can have a maximum of 4 decimal places" }
      )
      .nonoptional("amount_allocated is required"),
    organization_id: z
      .uuid("organization_id must be a valid UUID")
      .nonoptional("organization_id is required"),
  })
  .strict();

module.exports = createAllocationSchema;
