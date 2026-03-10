import { defineAction } from "astro:actions";
import { date, z } from "astro:schema";

export const server = {
  bookingForm: defineAction({
    accept: "form",
    input: z
      .object({
        name: z.preprocess(
          (val) => (val === null ? "" : val),
          z
            .string()
            .trim()
            .nonempty({ message: `This field is required` })
            .min(2, { message: "Name must be at least 2 characters" })
        ),
        email: z.preprocess(
          (val) => (val === null ? "" : val),
          z
            .string()
            .trim()
            .nonempty({ message: `This field is required` })
            .email({ message: `Please enter a valid email` })
        ),
        day: z.string().nullable(),
        month: z.string().nullable(),
        year: z.string().nullable(),
        hour: z.string().nullable(),
        minute: z.string().nullable(),
        meridiem: z.enum(["AM", "PM"]),
        count: z.number().nullable(),
      })

      .superRefine((val, ctx) => {
        // Normalize strings, make it easier to work with the values

        const day = (val.day ?? "").toString().trim();
        const month = (val.month ?? "").toString().trim();
        const year = (val.year ?? "").toString().trim();
        const hour = (val.hour ?? "").toString().trim();
        const minute = (val.minute ?? "").toString().trim();
        const meridiem = (val.meridiem ?? "").toString().trim();

        const dateFilled = [day, month, year].filter((v) => v !== "").length;
        const timeFilled = [hour, minute, meridiem].filter(
          (v) => v !== ""
        ).length;

        // Date validation
        if (dateFilled === 0) {
          ["day", "month", "year"].forEach((field) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `This field is required`,
              path: [field],
            });
          });
        } else if (dateFilled > 0 && dateFilled < 3) {
          ["day", "month", "year"].forEach((field) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `This field is incomplete`,
              path: [field],
            });
          });
        } else if (dateFilled === 3) {
          const dayNum = Number(day);
          const monthNum = Number(month);
          const yearNum = Number(year);

          if (isNaN(dayNum) || dayNum < 1 || dayNum > 31) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid day`,
              path: ["day"],
            });
          }
          if (isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid month`,
              path: [`month`],
            });
          }
          if (isNaN(yearNum) || year.length !== 4) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid year`,
              path: [`year`],
            });
          }

          // Real time date sanity check here
        }

        if (timeFilled === 0) {
          ["hour", "minute", "merdiem"].forEach((field) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `This field is incomplete`,
              path: [field],
            });
          });
        } else if (timeFilled > 0 && timeFilled < 3) {
          ["hour", "minute", "meridiem"].forEach((field) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `This field is incomplete`,
              path: [field],
            });
          });
        } else if (timeFilled === 3) {
          const hourNum = Number(hour);
          const minuteNum = Number(minute);
          if (isNaN(hourNum) || hourNum < 1 || hourNum > 12) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid hour`,
              path: ["hour"],
            });
          }
          if (isNaN(minuteNum) || minuteNum < 0 || minuteNum > 59) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Invalid minute`,
              path: [`minute`],
            });
          }
        }
      }),

    handler: async (input) => {
      console.log(`Success`);
      return { success: true };
    },
  }),
};
