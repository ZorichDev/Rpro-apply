import dotenv from "dotenv";
import path from "path";

// Backend is run with its own package as cwd (via turbo/pnpm --filter),
// but .env lives at the monorepo root — so point dotenv at it explicitly.
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

function required(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 5000),
  mongodbUri: required("MONGODB_URI", "mongodb://localhost:27017/rpro-apply"),
  jwtAccessSecret: required("JWT_ACCESS_SECRET"),
  jwtRefreshSecret: required("JWT_REFRESH_SECRET"),
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:5173",
  // The admin app runs as a genuinely separate frontend (its own port),
  // so it needs its own CORS allowance — see app.ts's allowedOrigins list.
  adminClientUrl: process.env.ADMIN_CLIENT_URL ?? "http://localhost:5174",
  // All optional — if SMTP_HOST is unset, utils/email.ts falls back to
  // logging emails to the console instead of sending them for real.
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM ?? "R-Pro Apply <no-reply@rprogroup.com.ng>",
  },
  // Optional at server-startup — a placeholder/test key is fine here.
  // Calls to Flutterwave will simply fail with a clear error until a
  // real (test or live) secret key is set, rather than crashing the
  // server on boot for something unrelated to payments.
  flutterwave: {
    secretKey: process.env.FLW_SECRET_KEY,
    currency: process.env.FLW_CURRENCY ?? "USD",
  },
};
