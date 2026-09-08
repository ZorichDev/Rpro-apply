"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateApplicationStatusSchema = exports.createApplicationSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../constants/roles");
exports.createApplicationSchema = zod_1.z.object({
    programId: zod_1.z.string().min(1),
    personalStatement: zod_1.z.string().min(50, "Personal statement should be at least 50 characters"),
});
exports.updateApplicationStatusSchema = zod_1.z.object({
    status: zod_1.z.enum([
        roles_1.APPLICATION_STATUS.UNDER_REVIEW,
        roles_1.APPLICATION_STATUS.OFFER_MADE,
        roles_1.APPLICATION_STATUS.ACCEPTED,
        roles_1.APPLICATION_STATUS.REJECTED,
    ]),
    reviewNote: zod_1.z.string().max(1000).optional(),
});
