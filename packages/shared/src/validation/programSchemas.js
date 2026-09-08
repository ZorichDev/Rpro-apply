"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProgramSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../constants/roles");
exports.createProgramSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    level: zod_1.z.enum(["undergraduate", "postgraduate", "diploma", "certificate"]),
    country: zod_1.z.string().min(1),
    tuitionAmount: zod_1.z.number().min(0),
    currency: zod_1.z.enum(roles_1.CURRENCIES),
    description: zod_1.z.string().max(2000).optional(),
});
