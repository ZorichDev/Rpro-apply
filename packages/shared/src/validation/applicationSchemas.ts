import { z } from "zod";
import { APPLICATION_STATUS } from "../constants/roles";

export const createApplicationSchema = z.object({
  programId: z.string().min(1),
  personalStatement: z.string().min(50, "Personal statement should be at least 50 characters"),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    APPLICATION_STATUS.UNDER_REVIEW,
    APPLICATION_STATUS.OFFER_MADE,
    APPLICATION_STATUS.ACCEPTED,
    APPLICATION_STATUS.REJECTED,
  ]),
  reviewNote: z.string().max(1000).optional(),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;
