import { useEffect, useState } from "react";
import { fetchReceivedLoanRequests, decideLoanRequestRequest } from "../../api/loanRequests";
import { formatCurrency } from "../../utils/currency";

interface LoanRequestRow {
  _id: string;
  amountRequested: number;
  currency: string;
  monthlyIncome: number;
  purpose: string;
  status: string;
  studentId: { firstName: string; lastName: string; email: string; country: string } | null;
  serviceId: { title: string } | null;
}

export default function ReceivedLoanRequests() {
  const [requests, setRequests] = useState<LoanRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetchReceivedLoanRequests()
      .then(({ data }) => setRequests(data.loanRequests))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDecide(id: string, status: "approved" | "rejected") {
    setBusyId(id);
    try {
      await decideLoanRequestRequest(id, status);
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (requests.length === 0) {
    return <p className="text-muted text-sm">No loan requests received yet.</p>;
  }

  return (
    <div className="max-w-2xl grid gap-3">
      {requests.map((r) => (
        <div key={r._id} className="card !p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-bold">
              {r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName}` : "Unknown student"}
            </p>
            <span
              className={`badge ${
                r.status === "approved" ? "badge-success" : r.status === "rejected" ? "badge-brand" : "badge-amber"
              }`}
            >
              {r.status}
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            {r.studentId?.email} · {r.studentId?.country}
          </p>
          <div className="grid grid-cols-2 gap-3 mt-3 py-3 border-y border-line text-sm">
            <div>
              <p className="text-muted text-xs">Amount requested</p>
              <p className="font-bold">{formatCurrency(r.amountRequested, r.currency)}</p>
            </div>
            <div>
              <p className="text-muted text-xs">Monthly income</p>
              <p className="font-bold">{formatCurrency(r.monthlyIncome, r.currency)}</p>
            </div>
          </div>
          <p className="text-sm text-ink2 mt-3">{r.purpose}</p>

          {r.status === "pending" && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleDecide(r._id, "approved")}
                disabled={busyId === r._id}
                className="btn-secondary !text-xs"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecide(r._id, "rejected")}
                disabled={busyId === r._id}
                className="text-xs font-semibold text-brand"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
