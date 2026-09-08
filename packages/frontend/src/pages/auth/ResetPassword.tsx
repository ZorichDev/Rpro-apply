import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { resetPasswordRequest } from "../../api/auth";

export default function ResetPassword() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError(null);
    setLoading(true);
    try {
      await resetPasswordRequest(token, newPassword);
      navigate("/login");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="card w-full max-w-sm">
        <h1 className="font-display font-black text-2xl tracking-tight mb-1">Set a new password</h1>
        <p className="text-muted text-sm mb-6">
          <Link to="/login" className="text-brand font-semibold">Back to sign in</Link>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="field-label">New password</label>
            <input
              id="newPassword"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="field-input"
            />
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Saving…" : "Reset password"}
          </button>
        </form>
      </div>
    </main>
  );
}
