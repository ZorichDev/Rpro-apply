import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { registerSchema, loginSchema, requestPasswordResetSchema, resetPasswordSchema, ROLES } from "shared";
import { User } from "../models/User";
import { Student } from "../models/Student";
import { Institution } from "../models/Institution";
import { Vendor } from "../models/Vendor";
import { RecruitmentPartner } from "../models/RecruitmentPartner";
import { signAccessToken, signRefreshToken } from "../utils/jwt";
import { generateReferralCode } from "../utils/referralCode";
import { generateVerificationToken, hashToken } from "../utils/verificationToken";
import { sendEmail } from "../utils/email";
import { env } from "../config/env";
import type { AuthedRequest } from "../middleware/auth";
const modelByRole = {
  [ROLES.STUDENT]: Student,
  [ROLES.INSTITUTION]: Institution,
  [ROLES.VENDOR]: Vendor,
  [ROLES.RECRUITMENT_PARTNER]: RecruitmentPartner,
} as const;

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }
    const { email, password, role, referralCode } = parsed.data;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // If a referral code was supplied, attribute this signup to that
    // recruitment partner. An unknown code is silently ignored rather than
    // blocking registration — a bad/stale link shouldn't lock someone out.
    let referredBy: string | undefined;
    if (referralCode) {
      const partner = await RecruitmentPartner.findOne({ referralCode });
      if (partner) referredBy = partner.id;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const Model = modelByRole[role as keyof typeof modelByRole];

    // Role-specific required fields (name, country, etc.) are collected in
    // the profile-completion step (PATCH /api/users/me/profile). The
    // recruitment partner's referral code is the one exception: it's
    // system-assigned, not user-entered, so it's generated here.
    const extraFields =
      role === ROLES.RECRUITMENT_PARTNER ? { referralCode: generateReferralCode() } : {};

    const { token: verificationToken, hash: verificationHash } = generateVerificationToken();

    // `Model` is a union of four differently-shaped discriminator types
    // (Student/Institution/Vendor/RecruitmentPartner), and TypeScript
    // can't unify their .create() overloads — cast is required, not
    // optional, or this won't compile.
    const user = await (Model as any).create({
      email,
      passwordHash,
      role,
      referredBy,
      emailVerificationTokenHash: verificationHash,
      emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      ...extraFields,
    });

    const verifyUrl = `${env.clientUrl}/verify-email/${verificationToken}`;
    await sendEmail(
      user.email,
      "Verify your R-Pro Apply account",
      `Click to verify your email: ${verifyUrl}\n\nThis link expires in 24 hours.`
    );

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    res.status(201).json({
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }
    const { email, password } = parsed.data;

    const user = await User.findOne({ email, isDeleted: { $ne: true } }).select("+passwordHash");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.isSuspended) {
      return res.status(403).json({ message: "This account has been suspended" });
    }

    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const refreshToken = signRefreshToken({ sub: user.id, role: user.role });
    user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
    await user.save();

    res.json({
      user: { id: user.id, email: user.email, role: user.role },
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };
    if (!refreshToken) {
      return res.status(400).json({ message: "refreshToken is required" });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(payload.sub).select("+refreshTokenHash");
    if (!user || user.isDeleted || user.isSuspended || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Confirms this is the same refresh token we last issued — rejects a
    // token from an old session that was already rotated out (e.g. after
    // a password reset or a previous refresh).
    const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Rotate on every use: issuing a brand new refresh token (not reusing
    // the old one) means a stolen refresh token stops working the moment
    // the legitimate owner refreshes again.
    const accessToken = signAccessToken({ sub: user.id, role: user.role });
    const newRefreshToken = signRefreshToken({ sub: user.id, role: user.role });
    user.refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
    await user.save();

    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}

export async function logout(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    await User.findByIdAndUpdate(req.user!.id, { refreshTokenHash: undefined });
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
}

export async function resendVerification(req: AuthedRequest, res: Response, next: NextFunction) {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.isVerified) {
      return res.status(400).json({ message: "This account is already verified" });
    }

    const { token: verificationToken, hash: verificationHash } = generateVerificationToken();
    user.emailVerificationTokenHash = verificationHash;
    user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await user.save();

    const verifyUrl = `${env.clientUrl}/verify-email/${verificationToken}`;
    await sendEmail(
      user.email,
      "Verify your R-Pro Apply account",
      `Click to verify your email: ${verifyUrl}\n\nThis link expires in 24 hours.`
    );

    res.json({ message: "Verification email sent" });
  } catch (err) {
    next(err);
  }
}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const hash = hashToken(req.params.token);
    const user = await User.findOne({
      emailVerificationTokenHash: hash,
      emailVerificationExpires: { $gt: new Date() },
    }).select("+emailVerificationTokenHash +emailVerificationExpires");

    if (!user) {
      return res.status(400).json({ message: "Verification link is invalid or has expired" });
    }

    user.isVerified = true;
    user.emailVerificationTokenHash = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified" });
  } catch (err) {
    next(err);
  }
}

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = requestPasswordResetSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const user = await User.findOne({ email: parsed.data.email, isDeleted: { $ne: true } });

    // Always respond the same way whether or not the email exists —
    // otherwise this endpoint becomes a way to check which emails are
    // registered on the platform.
    if (user) {
      const { token, hash } = generateVerificationToken();
      user.passwordResetTokenHash = hash;
      user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h
      await user.save();

      const resetUrl = `${env.clientUrl}/reset-password/${token}`;
      await sendEmail(
        user.email,
        "Reset your R-Pro Apply password",
        `Click to reset your password: ${resetUrl}\n\nThis link expires in 1 hour. If you didn't request this, ignore this email.`
      );
    }

    res.json({ message: "If that email is registered, a reset link has been sent" });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
    }

    const hash = hashToken(parsed.data.token);
    const user = await User.findOne({
      passwordResetTokenHash: hash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ message: "Reset link is invalid or has expired" });
    }

    user.passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    // Invalidate any existing session — a password reset should log out
    // anyone using the old credentials, including an attacker who had them.
    user.refreshTokenHash = undefined;
    await user.save();

    res.json({ message: "Password has been reset — you can now log in" });
  } catch (err) {
    next(err);
  }
}
