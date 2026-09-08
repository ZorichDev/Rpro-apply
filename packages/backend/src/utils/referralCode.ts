import crypto from "crypto";

/**
 * Generates a human-shareable referral code, e.g. "RPRO-8F2K9A".
 * Uniqueness is enforced at the DB level (unique index); on the rare
 * collision the caller should retry with a fresh call.
 */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I ambiguity
  const bytes = crypto.randomBytes(6);
  let suffix = "";
  for (const byte of bytes) {
    suffix += chars[byte % chars.length];
  }
  return `RPRO-${suffix}`;
}
