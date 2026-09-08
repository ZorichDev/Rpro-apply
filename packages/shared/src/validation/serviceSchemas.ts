import { z } from "zod";
import { SERVICE_CATEGORIES, CURRENCIES } from "../constants/roles";

export const createServiceSchema = z.object({
  title: z.string().min(1),
  category: z.enum(SERVICE_CATEGORIES),
  description: z.string().max(1000).optional(),
  priceAmount: z.number().min(0),
  currency: z.enum(CURRENCIES),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
