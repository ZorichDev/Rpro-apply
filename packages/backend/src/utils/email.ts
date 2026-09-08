import nodemailer from "nodemailer";
import { env } from "../config/env";

// Falls back to logging the email to the console if SMTP isn't configured
// yet, so the app never crashes for someone who hasn't set up a mail
// account. Once SMTP_HOST/SMTP_USER/SMTP_PASS are set in .env, this sends
// real email automatically — no other code needs to change.
const transporter = env.smtp.host
  ? nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.pass } : undefined,
    })
  : null;

export async function sendEmail(to: string, subject: string, body: string): Promise<void> {
  if (!transporter) {
    console.log("\n========== DEV EMAIL STUB (SMTP not configured) ==========");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(body);
    console.log("============================================================\n");
    return;
  }

  try {
    await transporter.sendMail({
      from: env.smtp.from,
      to,
      subject,
      text: body,
    });
    console.log(`[email] sent "${subject}" to ${to}`);
  } catch (err) {
    // A failed email should never crash the request that triggered it
    // (registration, password reset) — log it and move on. The token is
    // still valid in the database even if the email didn't arrive, so
    // the person can be told to try "resend" separately if needed.
    console.error(`[email] failed to send "${subject}" to ${to}`, err);
  }
}
