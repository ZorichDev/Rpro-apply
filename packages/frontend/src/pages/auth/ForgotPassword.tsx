import { useState } from "react";
import { Link } from "react-router-dom";
import { requestPasswordResetRequest } from "../../api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordResetRequest(email);
    } finally {
      setLoading(false);
      // Same message shown whether or not the email exists — matches the
      // backend's intentional non-disclosure of registered emails.
      setSubmitted(true);
    }
  }

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="card w-full max-w-sm">
        {submitted ? (
          <>
            <h1 className="font-display font-black text-2xl tracking-tight mb-2">Check your email</h1>
            <p className="text-muted text-sm">
              If that email is registered, a reset link is on its way. It expires in 1 hour.
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display font-black text-2xl tracking-tight mb-1">Reset your password</h1>
            <p className="text-muted text-sm mb-6">
              <Link to="/login" className="text-brand font-semibold">Back to sign in</Link>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="field-label">Email</label>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
