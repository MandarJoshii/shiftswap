import { z } from "zod";

export const claimSwapSchema = z.object({
  shiftId: z.number().int().positive(),
});

export type ClaimSwapInput = z.infer<typeof claimSwapSchema>;

export const listSwapsQuerySchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "COMPLETED"]).optional(),
});

export type ListSwapsQuery = z.infer<typeof listSwapsQuerySchema>;