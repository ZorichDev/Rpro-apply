import { Response, NextFunction } from "express";
import {
  ROLES,
  studentProfileSchema,
  institutionProfileSchema,
  vendorProfileSchema,
  recruitmentPartnerProfileSchema,
} from "shared";
import { User } from "../models/User";
import { Student } from "../models/Student";
import { Institution } from "../models/Institution";
import { Vendor } from "../models/Vendor";
import { RecruitmentPartner } from "../models/RecruitmentPartner";
import type { AuthedRequest } from "../middleware/auth";

const schemaByRole = {
  [ROLES.STUDENT]: studentProfileSchema,
  [ROLES.INSTITUTION]: institutionProfileSchema,
  [ROLES.VENDOR]: vendorProfileSchema,
  [ROLES.RECRUITMENT_PARTNER]: recruitmentPartnerProfileSchema,
} as const;

// Mirrors authController's modelByRole — every role-specific profile
// field (institutionName, firstName, companyName, bankName, etc.) only
// exists on these discriminator schemas, not on the base User schema.
const modelByRole = {
  [ROLES.STUDENT]: Student,
  [ROLES.INSTITUTION]: Institution,
  [ROLES.VENDOR]: Vendor,
  [ROLES.RECRUITMENT_PARTNER]: RecruitmentPartner,
} as const;

export async function getMe(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const role = req.user!.role;
    const schema = schemaByRole[role as keyof typeof schemaByRole];

    if (!schema) {
      // Admin or any role without a profile schema has nothing to complete here.
      return res.status(400).json({ message: "No profile fields for this role" });
    }

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    // CRITICAL: must use the role-specific discriminator model here, not
    // the base User model. Mongoose's default strict mode casts an
    // update against whichever schema is doing the update — the base
    // User schema has no idea what "institutionName" or "bankName" are,
    // so those fields get silently stripped before ever reaching the
    // database if this uses `User.findByIdAndUpdate` instead.
    const Model = modelByRole[role as keyof typeof modelByRole];
    const user = await (Model as any).findByIdAndUpdate(
      req.user!.id,
      { ...parsed.data, isProfileComplete: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
}

// Recruitment-partner-only: everyone who signed up through their referral code.
export async function getMyReferrals(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const referrals = await User.find({ referredBy: req.user!.id })
      .select("email role isProfileComplete createdAt")
      .sort({ createdAt: -1 });

    res.json({ referrals });
  } catch (err) {
    next(err);
  }
}
