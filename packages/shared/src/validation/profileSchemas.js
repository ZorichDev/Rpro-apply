"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recruitmentPartnerProfileSchema = exports.vendorProfileSchema = exports.institutionProfileSchema = exports.studentProfileSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../constants/roles");
exports.studentProfileSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    country: zod_1.z.string().min(1),
    dateOfBirth: zod_1.z.string().optional(),
});
exports.institutionProfileSchema = zod_1.z.object({
    institutionName: zod_1.z.string().min(1),
    country: zod_1.z.string().min(1),
    institutionType: zod_1.z.enum(roles_1.INSTITUTION_TYPES),
});
exports.vendorProfileSchema = zod_1.z.object({
    companyName: zod_1.z.string().min(1),
    serviceCategory: zod_1.z.enum(roles_1.SERVICE_CATEGORIES),
});
exports.recruitmentPartnerProfileSchema = zod_1.z.object({
    commissionRate: zod_1.z.number().min(0).max(1).optional(),
    bankName: zod_1.z.string().min(1).optional(),
    accountNumber: zod_1.z.string().min(1).optional(),
    accountName: zod_1.z.string().min(1).optional(),
});
