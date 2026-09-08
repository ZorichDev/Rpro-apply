import { z } from "zod";
import { CURRENCIES } from "../constants/roles";

export const createProgramSchema = z.object({
  title: z.string().min(1),
  level: z.enum(["undergraduate", "postgraduate", "diploma", "certificate"]),
  country: z.string().min(1),
  tuitionAmount: z.number().min(0),
  currency: z.enum(CURRENCIES),
  description: z.string().max(2000).optional(),
});

export type CreateProgramInput = z.infer<typeof createProgramSchema>;
