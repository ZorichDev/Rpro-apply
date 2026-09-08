import crypto from "crypto";

// Same pattern as a password: generate a random plain token to send in
// the email link, but only ever store its hash. If the database leaks,
// the stored hashes are useless without the original tokens.
export function generateVerificationToken(): { token: string; hash: string } {
  const token = crypto.randomBytes(32).toString("hex");
  const hash = crypto.createHash("sha256").update(token).digest("hex");
  return { token, hash };
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
