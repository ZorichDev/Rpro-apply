import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginRequest } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { dashboardPathForRole } from "../../utils/roleRouting";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";

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
      const { data } = await loginRequest(email, password);

      // Admin accounts have their own dedicated app now — this main app
      // has no admin routes left to send them to.
      if (data.user.role === "admin") {
        setError("Admin accounts sign in through the separate admin app, not here.");
        setLoading(false);
        return;
      }

      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate(dashboardPathForRole(data.user.role));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <TopNav />
      <main className="min-h-screen bg-soft flex items-center justify-center px-4 py-16">
        <div className="card w-full max-w-sm">
          <h1 className="font-display font-black text-2xl tracking-tight mb-1">Sign in</h1>
          <p className="text-muted text-sm mb-6">
            New here? <Link to="/register" className="text-brand font-semibold">Create an account</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="field-label">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="field-label !mb-0">Password</label>
                <Link to="/forgot-password" className="text-xs text-brand font-semibold">Forgot password?</Link>
              </div>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
            </div>

            {error && <p className="text-sm text-brand">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
