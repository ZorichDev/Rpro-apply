import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "../models/User";
import type { Role } from "shared";

export interface AuthedRequest extends Request {
  user?: { id: string; role: Role; email: string };
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or malformed Authorization header" });
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);

    // Checked on every request (not just at login) so a suspension or
    // removal takes effect immediately — an already-issued access token
    // would otherwise stay valid until it expires. Email is fetched here
    // too so downstream handlers (e.g. audit logging) don't need a
    // second lookup just to know who's making the request.
    const user = await User.findById(payload.sub).select("email isSuspended isDeleted");
    if (!user || user.isDeleted) {
      return res.status(401).json({ message: "Account not found" });
    }
    if (user.isSuspended) {
      return res.status(403).json({ message: "This account has been suspended" });
    }

    req.user = { id: payload.sub, role: payload.role, email: user.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
