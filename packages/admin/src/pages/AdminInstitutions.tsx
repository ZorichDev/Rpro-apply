import { useEffect, useState } from "react";
import { fetchInstitutionsForReview, verifyInstitutionRequest } from "../api/admin";

interface InstitutionRow {
  _id: string;
  email: string;
  institutionName?: string;
  country?: string;
  institutionType?: string;
  accreditationVerified: boolean;
  isProfileComplete: boolean;
}

export default function AdminInstitutions() {
  const [institutions, setInstitutions] = useState<InstitutionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetchInstitutionsForReview()
      .then(({ data }) => setInstitutions(data.institutions))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleVerify(id: string) {
    setBusyId(id);
    try {
      await verifyInstitutionRequest(id);
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (institutions.length === 0) return <p className="text-muted text-sm">No institutions registered yet.</p>;

  return (
    <div className="max-w-2xl grid gap-3">
      {institutions.map((inst) => (
        <div key={inst._id} className="card !p-5 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="font-bold">{inst.institutionName ?? "(profile incomplete)"}</p>
            <p className="text-sm text-muted">
              {inst.email} {inst.country && `· ${inst.country}`} {inst.institutionType && `· ${inst.institutionType}`}
            </p>
          </div>
          {inst.accreditationVerified ? (
            <span className="badge badge-success">Verified</span>
          ) : (
            <button
              onClick={() => handleVerify(inst._id)}
              disabled={busyId === inst._id || !inst.isProfileComplete}
              title={!inst.isProfileComplete ? "Institution hasn't completed their profile yet" : undefined}
              className="btn-secondary !text-xs"
            >
              {busyId === inst._id ? "Verifying…" : "Verify accreditation"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
