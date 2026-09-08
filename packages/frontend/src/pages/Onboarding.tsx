import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROLES, INSTITUTION_TYPES, SERVICE_CATEGORIES } from "shared";
import { useAuthStore } from "../store/authStore";
import { updateProfileRequest } from "../api/users";
import { dashboardPathForRole } from "../utils/roleRouting";

// Collects the role-specific fields that /auth/register intentionally
// skips (see backend authController). One form per role, same page.
export default function Onboarding() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  function update(key: string, value: string) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await updateProfileRequest(fields);
      navigate(dashboardPathForRole(user!.role));
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not save your profile.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "field-input";
  const labelClass = "field-label";

  function renderFields() {
    switch (user!.role) {
      case ROLES.STUDENT:
        return (
          <>
            <div>
              <label className={labelClass}>First name</label>
              <input required className={inputClass} onChange={(e) => update("firstName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Last name</label>
              <input required className={inputClass} onChange={(e) => update("lastName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input required className={inputClass} onChange={(e) => update("country", e.target.value)} />
            </div>
          </>
        );
      case ROLES.INSTITUTION:
        return (
          <>
            <div>
              <label className={labelClass}>Institution name</label>
              <input required className={inputClass} onChange={(e) => update("institutionName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Country</label>
              <input required className={inputClass} onChange={(e) => update("country", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Institution type</label>
              <select
                required
                className={inputClass}
                onChange={(e) => update("institutionType", e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select type
                </option>
                {INSTITUTION_TYPES.map((t) => (
                  <option key={t} value={t} >
                    {t.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case ROLES.VENDOR:
        return (
          <>
            <div>
              <label className={labelClass}>Company name</label>
              <input required className={inputClass} onChange={(e) => update("companyName", e.target.value)} />
            </div>
            <div>
              <label className={labelClass}>Service category</label>
              <select
                required
                className={inputClass}
                onChange={(e) => update("serviceCategory", e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select category
                </option>
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c} >
                    {c.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      case ROLES.RECRUITMENT_PARTNER:
        return (
          <p className="text-muted text-sm">
            Your referral code was generated automatically. Nothing else to fill in yet.
          </p>
        );
      default:
        return null;
    }
  }

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="card w-full max-w-sm">
        <h1 className="font-display font-black text-2xl tracking-tight mb-6">Complete your profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </main>
  );
}
