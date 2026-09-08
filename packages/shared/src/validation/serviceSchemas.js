"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServiceSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../constants/roles");
exports.createServiceSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    category: zod_1.z.enum(roles_1.SERVICE_CATEGORIES),
    description: zod_1.z.string().max(1000).optional(),
    priceAmount: zod_1.z.number().min(0),
    currency: zod_1.z.enum(roles_1.CURRENCIES),
});
