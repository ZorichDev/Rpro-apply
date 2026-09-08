"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../constants/roles");
exports.registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    role: zod_1.z.enum([
        roles_1.ROLES.STUDENT,
        roles_1.ROLES.INSTITUTION,
        roles_1.ROLES.VENDOR,
        roles_1.ROLES.RECRUITMENT_PARTNER,
    ]),
    referralCode: zod_1.z.string().optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1, "Password is required"),
});
