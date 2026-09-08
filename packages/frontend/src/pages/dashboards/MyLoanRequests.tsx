import { useEffect, useState } from "react";
import { fetchMyLoanRequests } from "../../api/loanRequests";
import { formatCurrency } from "../../utils/currency";

interface LoanRequestRow {
  _id: string;
  amountRequested: number;
  currency: string;
  purpose: string;
  status: string;
  reviewNote?: string;
  vendorId: { companyName: string } | null;
  serviceId: { title: string } | null;
}

export default function MyLoanRequests() {
  const [requests, setRequests] = useState<LoanRequestRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyLoanRequests()
      .then(({ data }) => setRequests(data.loanRequests))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (requests.length === 0) {
    return <p className="text-muted text-sm">No loan requests yet — apply from the Add-on services tab.</p>;
  }

  return (
    <div className="max-w-2xl grid gap-3">
      {requests.map((r) => (
        <div key={r._id} className="card !p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <p className="font-bold">{r.serviceId?.title ?? "Deleted service"}</p>
            <span
              className={`badge ${
                r.status === "approved" ? "badge-success" : r.status === "rejected" ? "badge-brand" : "badge-amber"
              }`}
            >
              {r.status}
            </span>
          </div>
          <p className="text-sm text-muted mt-1">
            {r.vendorId?.companyName ?? "Unknown vendor"} · Requested {formatCurrency(r.amountRequested, r.currency)}
          </p>
          <p className="text-sm text-ink2 mt-2">{r.purpose}</p>
          {r.reviewNote && <p className="text-sm text-muted mt-2 italic">"{r.reviewNote}"</p>}
        </div>
      ))}
    </div>
  );
}
