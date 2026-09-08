import { z } from "zod";

export const createLoanRequestSchema = z.object({
  serviceId: z.string().min(1),
  amountRequested: z.number().min(0),
  purpose: z.string().min(10, "Tell the lender what the loan is for (at least 10 characters)"),
  monthlyIncome: z.number().min(0),
});

export const decideLoanRequestSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  note: z.string().max(500).optional(),
});

export type CreateLoanRequestInput = z.infer<typeof createLoanRequestSchema>;
export type DecideLoanRequestInput = z.infer<typeof decideLoanRequestSchema>;
