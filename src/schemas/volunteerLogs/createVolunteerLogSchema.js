const { default: z } = require("zod");

const createVolunteerLogSchema = z
  .object({
    project_id: z.uuid("invalid project_id").optional(),
    hours_worked: z
      .int("invalid hours_worked")
      .positive("hours_worked must be positive")
      .nonoptional("hours_worked required"),
    description: z
      .string("invalid description")
      .max(1000, "description max length is 1000")
      .optional(),
  })
  .strict();

module.exports = createVolunteerLogSchema;
