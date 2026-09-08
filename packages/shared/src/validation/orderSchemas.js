import { z } from "zod";
export const createOrderSchema = z.object({
    serviceId: z.string().min(1),
});
