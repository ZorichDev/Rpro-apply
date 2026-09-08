import type { Role } from "../constants/roles";

export interface BaseUser {
  id: string;
  email: string;
  role: Role;
  isVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface StudentProfile extends BaseUser {
  firstName: string;
  lastName: string;
  country: string;
}

export interface InstitutionProfile extends BaseUser {
  institutionName: string;
  country: string;
  accreditationVerified: boolean;
}

export interface VendorProfile extends BaseUser {
  companyName: string;
  serviceCategory: string;
}

export interface RecruitmentPartnerProfile extends BaseUser {
  referralCode: string;
  commissionRate: number;
}

export interface ProgramSummary {
  id: string;
  institutionId: string;
  institutionName: string;
  country: string;
  title: string;
  level: string;
  tuitionUsd: number;
}

export interface ApplicationSummary {
  id: string;
  studentId: string;
  programId: string;
  programTitle: string;
  institutionName: string;
  status: string;
  submittedAt: string;
  reviewNote?: string;
}
