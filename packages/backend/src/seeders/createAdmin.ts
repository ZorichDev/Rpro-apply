// One-off script to create the first admin account, since admins can't
// self-register through the public /auth/register endpoint.
//
// Usage:
//   pnpm --filter backend seed:admin -- admin@rprogroup.com.ng SomeStrongPassword123
//
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db";
import { Admin } from "../models/Admin";
import mongoose from "mongoose";

async function main() {
  // pnpm sometimes forwards the "--" separator itself as a literal
  // argument rather than stripping it — filter it out so email/password
  // parsing works whether it shows up or not.
  const args = process.argv.slice(2).filter((a) => a !== "--");
  const [email, password] = args;

  if (!email || !password) {
    console.error("Usage: pnpm --filter backend seed:admin -- <email> <password>");
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ email, passwordHash, isVerified: true, isProfileComplete: true });

  console.log(`Admin created: ${email}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
