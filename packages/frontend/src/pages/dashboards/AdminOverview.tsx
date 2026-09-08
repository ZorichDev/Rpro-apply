import { useEffect, useState } from "react";
import { fetchAdminStats } from "../../api/admin";
import { formatCurrency } from "../../utils/currency";

interface Stats {
  users: { students: number; institutions: number; vendors: number; partners: number };
  applications: number;
  orders: { paid: number; revenueByCurrency: Record<string, number>; commissionByCurrency: Record<string, number> };
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (!stats) return <p className="text-muted text-sm">Could not load platform stats.</p>;

  const countCards = [
    { label: "Students", value: stats.users.students },
    { label: "Institutions", value: stats.users.institutions },
    { label: "Vendors", value: stats.users.vendors },
    { label: "Recruitment Partners", value: stats.users.partners },
    { label: "Applications submitted", value: stats.applications },
    { label: "Paid orders", value: stats.orders.paid },
  ];

  const revenueEntries = Object.entries(stats.orders.revenueByCurrency);
  const commissionEntries = Object.entries(stats.orders.commissionByCurrency);

  return (
    <div className="max-w-4xl space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {countCards.map((c) => (
          <div key={c.label} className="card !p-5">
            <p className="text-xs text-muted mb-1">{c.label}</p>
            <p className="font-display font-black text-2xl">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Revenue and commission are shown per currency, not summed into
          one number — the platform spans multiple countries' currencies
          and force-converting would misrepresent what was actually
          charged and earned. */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="card !p-5">
          <p className="text-xs text-muted mb-2">Total revenue by currency</p>
          {revenueEntries.length === 0 ? (
            <p className="text-sm text-muted">No paid orders yet.</p>
          ) : (
            <div className="space-y-1">
              {revenueEntries.map(([currency, amount]) => (
                <p key={currency} className="font-display font-black text-xl">
                  {formatCurrency(amount, currency)}
                </p>
              ))}
            </div>
          )}
        </div>
        <div className="card !p-5">
          <p className="text-xs text-muted mb-2">Total commission owed by currency</p>
          {commissionEntries.length === 0 ? (
            <p className="text-sm text-muted">No commission owed yet.</p>
          ) : (
            <div className="space-y-1">
              {commissionEntries.map(([currency, amount]) => (
                <p key={currency} className="font-display font-black text-xl">
                  {formatCurrency(amount, currency)}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
