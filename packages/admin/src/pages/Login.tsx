import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../api/client";
import { useAuthStore } from "../store/authStore";

export default function Login() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await apiClient.post("/auth/login", { email, password });

      // The login endpoint is shared across all roles — a valid password
      // doesn't mean this is an admin account. Reject here rather than
      // silently granting a student/institution/vendor/partner account
      // access to this app.
      if (data.user.role !== "admin") {
        setError("This account doesn't have admin access.");
        setLoading(false);
        return;
      }

      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="card w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <img src="/logo.png" alt="logo" className="w-8 h-8 rounded-lg object-contain" />
          <span className="text-base font-extrabold tracking-tight">
            R-Pro <span className="text-brand">Apply</span> <span className="text-muted font-normal">Admin</span>
          </span>
        </div>

        <h1 className="font-display font-black text-2xl tracking-tight mb-6">Sign in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="field-label">Email</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
          </div>
          <div>
            <label htmlFor="password" className="field-label">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
