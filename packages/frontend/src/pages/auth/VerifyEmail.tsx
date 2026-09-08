import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmailRequest } from "../../api/auth";

export default function VerifyEmail() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    if (!token) return;
    verifyEmailRequest(token)
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, [token]);

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="card w-full max-w-sm text-center">
        {status === "loading" && <p className="text-muted text-sm">Verifying your email…</p>}
        {status === "success" && (
          <>
            <h1 className="font-display font-black text-2xl tracking-tight mb-2">Email verified</h1>
            <p className="text-muted text-sm mb-6">Your account is confirmed.</p>
            <Link to="/login" className="btn-primary inline-block">Sign in →</Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="font-display font-black text-2xl tracking-tight mb-2">Link expired</h1>
            <p className="text-muted text-sm">This verification link is invalid or has expired.</p>
          </>
        )}
      </div>
    </main>
  );
}
