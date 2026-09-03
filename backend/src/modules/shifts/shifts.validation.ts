import { z } from "zod";

export const createShiftSchema = z
  .object({
    employeeId: z.number().int().positive().optional(),
    date: z.string().date("Date must be in YYYY-MM-DD format"),
    startTime: z.string().datetime({ message: "startTime must be a valid ISO datetime" }),
    endTime: z.string().datetime({ message: "endTime must be a valid ISO datetime" }),
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "endTime must be after startTime",
    path: ["endTime"],
  });

export type CreateShiftInput = z.infer<typeof createShiftSchema>;

export const updateShiftSchema = z
  .object({
    employeeId: z.number().int().positive().nullable().optional(),
    date: z.string().date("Date must be in YYYY-MM-DD format").optional(),
    startTime: z.string().datetime({ message: "startTime must be a valid ISO datetime" }).optional(),
    endTime: z.string().datetime({ message: "endTime must be a valid ISO datetime" }).optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.endTime) > new Date(data.startTime);
      }
      return true;
    },
    { message: "endTime must be after startTime", path: ["endTime"] }
  );

export type UpdateShiftInput = z.infer<typeof updateShiftSchema>;

export const listShiftsQuerySchema = z.object({
  employeeId: z.coerce.number().int().positive().optional(),
  startDate: z.string().date().optional(),
  endDate: z.string().date().optional(),
});

export type ListShiftsQuery = z.infer<typeof listShiftsQuerySchema>;