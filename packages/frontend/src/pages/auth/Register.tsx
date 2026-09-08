import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { ROLES } from "shared";
import type { Role } from "shared";
import { registerRequest } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import TopNav from "../../components/TopNav";
import Footer from "../../components/Footer";

const roleOptions: { value: Role; label: string }[] = [
  { value: ROLES.STUDENT, label: "Student" },
  { value: ROLES.INSTITUTION, label: "Institution" },
  { value: ROLES.VENDOR, label: "Vendor" },
  { value: ROLES.RECRUITMENT_PARTNER, label: "Recruitment partner" },
];

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>(ROLES.STUDENT);
  const [referralCode, setReferralCode] = useState(searchParams.get("ref") ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await registerRequest(email, password, role, referralCode || undefined);
      setAuth(data.user, data.accessToken, data.refreshToken);
      navigate("/onboarding");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <TopNav />
      <main className="min-h-screen bg-soft flex items-center justify-center px-4 py-16">
        <div className="card w-full max-w-sm">
          <h1 className="font-display font-black text-2xl tracking-tight mb-1">Create your account</h1>
          <p className="text-muted text-sm mb-6">
            Already have one? <Link to="/login" className="text-brand font-semibold">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="role" className="field-label">I am a</label>
              <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)} className="field-input">
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="email" className="field-label">Email</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
            </div>

            <div>
              <label htmlFor="password" className="field-label">Password</label>
              <input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
            </div>

            <div>
              <label htmlFor="referralCode" className="field-label">Referral code (optional)</label>
              <input
                id="referralCode"
                placeholder="e.g. RPRO-8F2K9A"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="field-input"
              />
            </div>

            {error && <p className="text-sm text-brand">{error}</p>}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
