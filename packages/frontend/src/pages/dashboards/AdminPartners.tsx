import { useEffect, useState } from "react";
import { fetchPartnerEarnings } from "../../api/admin";
import { formatCurrency } from "../../utils/currency";

interface PartnerRow {
  id: string;
  email: string;
  referralCode: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  earningsByCurrency: Record<string, number>;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartnerEarnings()
      .then(({ data }) => setPartners(data.partners))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (partners.length === 0) return <p className="text-muted text-sm">No recruitment partners registered yet.</p>;

  return (
    <div className="max-w-3xl grid gap-3">
      {partners.map((p) => {
        const earnings = Object.entries(p.earningsByCurrency);
        const hasBankDetails = p.bankName && p.accountNumber && p.accountName;

        return (
          <div key={p.id} className="card !p-5">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div>
                <p className="font-bold">{p.email}</p>
                <p className="text-xs text-muted">Code: {p.referralCode}</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {earnings.length === 0 ? (
                  <span className="badge badge-muted">No earnings yet</span>
                ) : (
                  earnings.map(([currency, amount]) => (
                    <span key={currency} className="badge badge-success">
                      {formatCurrency(amount, currency)}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-line">
              {hasBankDetails ? (
                <p className="text-sm text-ink2">
                  {p.bankName} · {p.accountNumber} · {p.accountName}
                </p>
              ) : (
                <p className="text-xs text-muted italic">No bank details on file yet.</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
