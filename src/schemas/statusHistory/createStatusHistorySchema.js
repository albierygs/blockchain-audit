const { default: z } = require("zod");

const createStatusHistorySchema = z
  .object({
    old_status: z
      .string("invalid old_status")
      .max(50, "old_status max length is 50")
      .optional(),
    new_status: z
      .string("invalid new_status")
      .min(1, "new_status min length is 1")
      .max(50, "new_status max length is 50")
      .nonoptional("new_status required"),
    reason: z
      .string("invalid reasin")
      .max(1000, "reason max length is 1000")
      .optional(),
    metadata: z.record(z.any()).optional(),
  })
  .strict();

module.exports = createStatusHistorySchema;
