import { Schema, model, Document, Types } from "mongoose";
import { ROLES, Role } from "shared";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: Role;
  isVerified: boolean;
  isProfileComplete: boolean;
  refreshTokenHash?: string;
  referredBy?: Types.ObjectId;
  isSuspended: boolean;
  suspendedReason?: string;
  isDeleted: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationExpires?: Date;
  passwordResetTokenHash?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userOptions = {
  discriminatorKey: "role",
  timestamps: true,
  collection: "users",
};

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: Object.values(ROLES),
      required: true,
    },
    isVerified: { type: Boolean, default: false },
    isProfileComplete: { type: Boolean, default: false },
    refreshTokenHash: { type: String, select: false },
    // Set at registration if a valid recruitment-partner referral code was
    // supplied. Points at the RecruitmentPartner's User document.
    referredBy: { type: Schema.Types.ObjectId, ref: "User", index: true },
    // Suspension is reversible and blocks access immediately (checked in
    // requireAuth, not just at login) — for policy violations, disputes
    // under investigation, etc.
    isSuspended: { type: Boolean, default: false },
    suspendedReason: { type: String, maxlength: 500 },
    // Soft delete: the account is deactivated and hidden from normal
    // listings, but the row (and everything referencing it — orders,
    // applications) is preserved rather than hard-deleted, since a hard
    // delete would break every populate() across the platform.
    isDeleted: { type: Boolean, default: false },
    // Only the hash is stored — the plain token goes out in the email
    // link and is never persisted, same pattern as a password.
    emailVerificationTokenHash: { type: String, select: false },
    emailVerificationExpires: { type: Date, select: false },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  userOptions
);

export const User = model<IUser>("User", userSchema);
