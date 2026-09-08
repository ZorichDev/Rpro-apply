import { useEffect, useState } from "react";
import { fetchAllBonuses, markBonusPaidRequest } from "../../api/admin";
import { formatCurrency } from "../../utils/currency";

interface BonusRow {
  _id: string;
  amountNgn: number;
  status: string;
  createdAt: string;
  partnerId: { email: string; referralCode: string };
  studentId: { email: string };
}

export default function AdminBonuses() {
  const [bonuses, setBonuses] = useState<BonusRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetchAllBonuses()
      .then(({ data }) => setBonuses(data.bonuses))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleMarkPaid(id: string) {
    setBusyId(id);
    try {
      await markBonusPaidRequest(id);
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (bonuses.length === 0) return <p className="text-muted text-sm">No success bonuses owed yet.</p>;

  return (
    <div className="max-w-3xl grid gap-3">
      {bonuses.map((b) => (
        <div key={b._id} className="card !p-5 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="font-bold">{b.partnerId.email}</p>
            <p className="text-sm text-muted">
              Student: {b.studentId.email} · {formatCurrency(b.amountNgn, "NGN")}
            </p>
          </div>
          {b.status === "paid" ? (
            <span className="badge badge-success">Paid</span>
          ) : (
            <button onClick={() => handleMarkPaid(b._id)} disabled={busyId === b._id} className="btn-secondary !text-xs">
              {busyId === b._id ? "Marking…" : "Mark as paid"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
