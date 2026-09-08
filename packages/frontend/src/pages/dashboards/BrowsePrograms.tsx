import { useEffect, useState } from "react";
import { fetchPrograms } from "../../api/programs";
import { submitApplication } from "../../api/applications";
import { formatCurrency } from "../../utils/currency";

interface Program {
  _id: string;
  title: string;
  level: string;
  country: string;
  tuitionAmount: number;
  currency: string;
  institutionId: { institutionName: string; country: string };
}

export default function BrowsePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState<Program | null>(null);
  const [statement, setStatement] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPrograms()
      .then(({ data }) => setPrograms(data.programs))
      .finally(() => setLoading(false));
  }, []);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!applyingTo) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      await submitApplication({ programId: applyingTo._id, personalStatement: statement });
      setFeedback(`Application submitted to ${applyingTo.institutionId.institutionName}.`);
      setApplyingTo(null);
      setStatement("");
    } catch (err: any) {
      setFeedback(err?.response?.data?.message ?? "Could not submit application.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading programs…</p>;

  if (programs.length === 0) {
    return <p className="text-muted text-sm">No programs listed yet — check back soon.</p>;
  }

  return (
    <div className="max-w-2xl">
      {feedback && <p className="text-sm text-success font-medium mb-4">{feedback}</p>}

      <div className="grid gap-3">
        {programs.map((p) => (
          <div key={p._id} className="card flex items-center justify-between flex-wrap gap-2 !p-5">
            <div>
              <p className="font-bold">{p.title}</p>
              <p className="text-sm text-muted">
                {p.institutionId.institutionName} · {p.country} · {p.level} · {formatCurrency(p.tuitionAmount, p.currency)}/yr
              </p>
            </div>
            <button onClick={() => setApplyingTo(p)} className="btn-primary">
              Apply
            </button>
          </div>
        ))}
      </div>

      {applyingTo && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center px-4" onClick={() => setApplyingTo(null)}>
          <form onSubmit={handleApply} onClick={(e) => e.stopPropagation()} className="card w-full max-w-md space-y-4 relative">
            <button
              type="button"
              onClick={() => setApplyingTo(null)}
              aria-label="Close"
              className="absolute top-5 right-5 text-muted hover:text-ink text-lg leading-none"
            >
              ×
            </button>
            <h2 className="font-display font-black text-xl pr-6">Apply to {applyingTo.title}</h2>
            <textarea
              required
              minLength={50}
              rows={5}
              placeholder="Personal statement (min. 50 characters)"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="field-input"
            />
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setApplyingTo(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="btn-primary">
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
