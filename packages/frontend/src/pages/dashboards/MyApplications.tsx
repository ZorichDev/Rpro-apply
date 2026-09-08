import { useEffect, useState } from "react";
import { fetchMyApplications } from "../../api/applications";
import StatusBadge from "../../components/StatusBadge";

interface Application {
  _id: string;
  status: string;
  submittedAt: string;
  reviewNote?: string;
  programId: { title: string; level: string } | null;
  institutionId: { institutionName: string; country: string } | null;
}

export default function MyApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyApplications()
      .then(({ data }) => setApplications(data.applications))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Loading…</p>;

  if (applications.length === 0) {
    return <p className="text-muted text-sm">No applications yet. Browse programs to get started.</p>;
  }

  return (
    <div className="max-w-2xl grid gap-3">
      {applications.map((a) => (
        <div key={a._id} className="card !p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-bold">{a.programId?.title ?? "Deleted program"}</p>
            <StatusBadge status={a.status} />
          </div>
          <p className="text-sm text-muted mt-1">
            {a.institutionId ? `${a.institutionId.institutionName} · ${a.institutionId.country}` : "This institution no longer exists"}
          </p>
          {a.reviewNote && <p className="text-sm text-ink2 mt-3 italic">"{a.reviewNote}"</p>}
        </div>
      ))}
    </div>
  );
}
