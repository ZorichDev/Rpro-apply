"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decideLoanRequestSchema = exports.createLoanRequestSchema = void 0;
const zod_1 = require("zod");
exports.createLoanRequestSchema = zod_1.z.object({
    serviceId: zod_1.z.string().min(1),
    amountRequested: zod_1.z.number().min(0),
    purpose: zod_1.z.string().min(10, "Tell the lender what the loan is for (at least 10 characters)"),
    monthlyIncome: zod_1.z.number().min(0),
});
exports.decideLoanRequestSchema = zod_1.z.object({
    status: zod_1.z.enum(["approved", "rejected"]),
    note: zod_1.z.string().max(500).optional(),
});
