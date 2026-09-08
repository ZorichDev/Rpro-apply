import { z } from "zod";

export const createOrderSchema = z.object({
  serviceId: z.string().min(1),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
