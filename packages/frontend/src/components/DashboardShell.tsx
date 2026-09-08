import { ReactNode, useEffect, useState } from "react";
import TopNav from "./TopNav";
import { fetchMe } from "../api/users";
import { resendVerificationRequest } from "../api/auth";

interface DashboardShellProps {
  title: string;
  children: ReactNode;
}

export default function DashboardShell({ title, children }: DashboardShellProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [sendState, setSendState] = useState<"idle" | "sending" | "sent">("idle");

  useEffect(() => {
    fetchMe()
      .then(({ data }) => setIsVerified(Boolean(data.user.isVerified)))
      .catch(() => setIsVerified(null));
  }, []);

  async function handleResend() {
    setSendState("sending");
    try {
      await resendVerificationRequest();
      setSendState("sent");
    } catch {
      setSendState("idle");
    }
  }

  return (
    <div className="min-h-screen bg-soft">
      <TopNav variant="app" title={title} />

      {isVerified === false && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 md:px-8 py-3 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-ink2">Verify your email to unlock full access to your account.</p>
          {sendState === "sent" ? (
            <span className="text-sm text-success font-semibold">Sent — check your inbox</span>
          ) : (
            <button onClick={handleResend} disabled={sendState === "sending"} className="text-sm font-bold text-brand disabled:opacity-50">
              {sendState === "sending" ? "Sending…" : "Resend verification email"}
            </button>
          )}
        </div>
      )}

      <main className="max-w-6xl mx-auto px-6 md:px-8 py-10">
        <h1 className="font-display text-3xl font-black tracking-tight mb-8">{title}</h1>
        {children}
      </main>
    </div>
  );
}
