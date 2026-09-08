import { Schema } from "mongoose";
import { ROLES } from "shared";
import { User } from "./User";

const recruitmentPartnerSchema = new Schema({
  referralCode: { type: String, required: true, unique: true },
  commissionRate: { type: Number, default: 0.05 },
  // Payout bank details — editable anytime via PATCH /users/me/profile,
  // not locked in at onboarding. None of this is validated against a
  // real bank (no account-verification API connected) — it's exactly
  // what the partner types in, same trust level as a plain text field
  // on any admin-run manual payout process.
  bankName: { type: String, trim: true },
  accountNumber: { type: String, trim: true },
  accountName: { type: String, trim: true },
});

export const RecruitmentPartner = User.discriminator(
  ROLES.RECRUITMENT_PARTNER,
  recruitmentPartnerSchema
);
