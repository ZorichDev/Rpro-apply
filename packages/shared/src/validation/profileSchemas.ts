import { z } from "zod";
import { INSTITUTION_TYPES, SERVICE_CATEGORIES } from "../constants/roles";

export const studentProfileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  country: z.string().min(1),
  dateOfBirth: z.string().optional(),
});

export const institutionProfileSchema = z.object({
  institutionName: z.string().min(1),
  country: z.string().min(1),
  institutionType: z.enum(INSTITUTION_TYPES),
});

export const vendorProfileSchema = z.object({
  companyName: z.string().min(1),
  serviceCategory: z.enum(SERVICE_CATEGORIES),
});

export const recruitmentPartnerProfileSchema = z.object({
  commissionRate: z.number().min(0).max(1).optional(),
  bankName: z.string().min(1).optional(),
  accountNumber: z.string().min(1).optional(),
  accountName: z.string().min(1).optional(),
});

export type StudentProfileInput = z.infer<typeof studentProfileSchema>;
export type InstitutionProfileInput = z.infer<typeof institutionProfileSchema>;
export type VendorProfileInput = z.infer<typeof vendorProfileSchema>;
export type RecruitmentPartnerProfileInput = z.infer<typeof recruitmentPartnerProfileSchema>;
