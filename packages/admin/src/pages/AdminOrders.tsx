import { useEffect, useState } from "react";
import { fetchPaidOrders, setOrderSelfCloseRequest } from "../api/admin";
import { formatCurrency } from "../utils/currency";

interface OrderRow {
  _id: string;
  amount: number;
  currency: string;
  commissionAmount: number;
  commissionRate: number;
  isSelfClose: boolean;
  paidAt: string;
  studentId: { email: string };
  serviceId: { title: string };
  referralPartnerId: { email: string; referralCode: string };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetchPaidOrders()
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleToggle(id: string, current: boolean) {
    setBusyId(id);
    try {
      await setOrderSelfCloseRequest(id, !current);
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (orders.length === 0) return <p className="text-muted text-sm">No commission-generating orders yet.</p>;

  return (
    <div className="max-w-3xl space-y-3">
      <p className="text-xs text-muted bg-soft rounded-lg px-3 py-2">
        Mark an order "self-closed" when the partner both referred the student AND closed the sale
        themselves — this retroactively applies the 10% tier instead of the default 7% referral-only rate.
      </p>
      <div className="grid gap-3">
        {orders.map((o) => (
          <div key={o._id} className="card !p-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="font-bold">{o.serviceId.title}</p>
                <p className="text-sm text-muted">
                  {o.studentId.email} · Partner: {o.referralPartnerId.email}
                </p>
              </div>
              <span className="badge badge-success">
                {formatCurrency(o.commissionAmount, o.currency)} ({Math.round(o.commissionRate * 100)}%)
              </span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <label className="flex items-center gap-2 text-xs font-semibold text-ink2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={o.isSelfClose}
                  disabled={busyId === o._id}
                  onChange={() => handleToggle(o._id, o.isSelfClose)}
                />
                Self-closed by partner (10%)
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
