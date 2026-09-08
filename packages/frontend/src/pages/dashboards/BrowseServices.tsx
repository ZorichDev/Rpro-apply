import { useEffect, useState } from "react";
import { fetchServices } from "../../api/services";
import { createOrderRequest } from "../../api/orders";
import { createLoanRequestRequest } from "../../api/loanRequests";
import { formatCurrency } from "../../utils/currency";

interface ServiceListing {
  _id: string;
  title: string;
  category: string;
  priceAmount: number;
  currency: string;
  vendorId: { companyName: string };
}

export default function BrowseServices() {
  const [services, setServices] = useState<ServiceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Loan application modal state — separate from the plain "add a
  // service" flow, since a loan isn't something you buy up front.
  const [loanTarget, setLoanTarget] = useState<ServiceListing | null>(null);
  const [loanForm, setLoanForm] = useState({ amountRequested: "", purpose: "", monthlyIncome: "" });
  const [submittingLoan, setSubmittingLoan] = useState(false);
  const [loanError, setLoanError] = useState<string | null>(null);

  useEffect(() => {
    fetchServices()
      .then(({ data }) => setServices(data.services))
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(service: ServiceListing) {
    setAddingId(service._id);
    setFeedback(null);
    try {
      await createOrderRequest(service._id);
      setFeedback(`Added ${service.title} to My Orders — pay from there to confirm.`);
    } catch (err: any) {
      setFeedback(err?.response?.data?.message ?? "Could not add service.");
    } finally {
      setAddingId(null);
    }
  }

  async function handleSubmitLoan(e: React.FormEvent) {
    e.preventDefault();
    if (!loanTarget) return;
    setLoanError(null);
    setSubmittingLoan(true);
    try {
      await createLoanRequestRequest({
        serviceId: loanTarget._id,
        amountRequested: Number(loanForm.amountRequested),
        purpose: loanForm.purpose,
        monthlyIncome: Number(loanForm.monthlyIncome),
      });
      setFeedback(`Loan request sent to ${loanTarget.vendorId.companyName} — check My Loan Requests for a decision.`);
      setLoanTarget(null);
      setLoanForm({ amountRequested: "", purpose: "", monthlyIncome: "" });
    } catch (err: any) {
      setLoanError(err?.response?.data?.message ?? "Could not submit loan request.");
    } finally {
      setSubmittingLoan(false);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading services…</p>;

  if (services.length === 0) {
    return <p className="text-muted text-sm">No services listed yet — check back soon.</p>;
  }

  return (
    <div className="max-w-2xl space-y-4">
      {feedback && <p className="text-sm text-success font-medium">{feedback}</p>}
      <div className="grid gap-3">
        {services.map((s) => {
          const isLoan = s.category === "loans";
          return (
            <div key={s._id} className="card !p-5 flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">{s.title}</p>
                <p className="text-sm text-muted">
                  {s.vendorId.companyName} · {s.category.replace("_", " ")}
                  {!isLoan && ` · ${formatCurrency(s.priceAmount, s.currency)}`}
                  {isLoan && ` · up to ${formatCurrency(s.priceAmount, s.currency)}`}
                </p>
              </div>
              {isLoan ? (
                <button onClick={() => setLoanTarget(s)} className="btn-primary">
                  Apply for loan
                </button>
              ) : (
                <button onClick={() => handleAdd(s)} disabled={addingId === s._id} className="btn-primary">
                  {addingId === s._id ? "Adding…" : "Add"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {loanTarget && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center px-4" onClick={() => setLoanTarget(null)}>
          <form
            onSubmit={handleSubmitLoan}
            onClick={(e) => e.stopPropagation()}
            className="card w-full max-w-md space-y-4 relative"
          >
            <button
              type="button"
              onClick={() => setLoanTarget(null)}
              aria-label="Close"
              className="absolute top-5 right-5 text-muted hover:text-ink text-lg leading-none"
            >
              ×
            </button>
            <h2 className="font-display font-black text-xl pr-6">Apply for {loanTarget.title}</h2>
            <p className="text-sm text-muted -mt-2">from {loanTarget.vendorId.companyName}</p>

            <div>
              <label className="field-label">Amount requested ({loanTarget.currency})</label>
              <input
                required
                type="number"
                min="0"
                className="field-input"
                value={loanForm.amountRequested}
                onChange={(e) => setLoanForm({ ...loanForm, amountRequested: e.target.value })}
              />
            </div>

            <div>
              <label className="field-label">Monthly income ({loanTarget.currency})</label>
              <input
                required
                type="number"
                min="0"
                className="field-input"
                value={loanForm.monthlyIncome}
                onChange={(e) => setLoanForm({ ...loanForm, monthlyIncome: e.target.value })}
              />
            </div>

            <div>
              <label className="field-label">What's this loan for?</label>
              <textarea
                required
                minLength={10}
                rows={3}
                placeholder="e.g. covering tuition for my first semester"
                className="field-input"
                value={loanForm.purpose}
                onChange={(e) => setLoanForm({ ...loanForm, purpose: e.target.value })}
              />
            </div>

            {loanError && <p className="text-sm text-brand">{loanError}</p>}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setLoanTarget(null)} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={submittingLoan} className="btn-primary">
                {submittingLoan ? "Submitting…" : "Submit application"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
