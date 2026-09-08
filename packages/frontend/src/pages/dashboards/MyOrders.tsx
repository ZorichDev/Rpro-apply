import { useEffect, useState } from "react";
import { fetchMyOrders, initiateCheckoutRequest, payOrderRequest } from "../../api/orders";
import { formatCurrency } from "../../utils/currency";

interface Order {
  _id: string;
  status: string;
  amount: number;
  currency: string;
  serviceId: { title: string; category: string } | null;
  vendorId: { companyName: string } | null;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function load() {
    fetchMyOrders()
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handlePay(id: string) {
    setPayingId(id);
    setError(null);
    try {
      const { data } = await initiateCheckoutRequest(id);
      // Full-page redirect to Flutterwave's hosted checkout — this leaves
      // the app entirely and comes back to /orders/callback afterward.
      window.location.href = data.paymentLink;
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not start payment.");
      setPayingId(null);
    }
  }

  // DEMO ONLY: bypasses Flutterwave entirely, for testing the order →
  // commission → bonus flow before a real gateway key is configured.
  // Remove this button once FLW_SECRET_KEY is a real key.
  async function handleSimulatePay(id: string) {
    setPayingId(id);
    setError(null);
    try {
      await payOrderRequest(id);
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not simulate payment.");
    } finally {
      setPayingId(null);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>;

  if (orders.length === 0) {
    return <p className="text-muted text-sm">No services added yet. Browse services to get started.</p>;
  }

  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-xs text-muted bg-soft rounded-lg px-3 py-2">
        "Pay with Flutterwave" uses your real (currently placeholder) API key and will fail until you add
        a real one. "Simulate payment (demo)" skips Flutterwave entirely so you can test the rest of the
        flow right now.
      </p>
      {error && <p className="text-sm text-brand">{error}</p>}
      <div className="grid gap-3">
        {orders.map((o) => (
          <div key={o._id} className="card !p-5 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-bold">{o.serviceId?.title ?? "Deleted service"}</p>
              <p className="text-sm text-muted">
                {o.vendorId?.companyName ?? "Unknown vendor"} · {formatCurrency(o.amount, o.currency)}
              </p>
            </div>
            {o.status === "paid" ? (
              <span className="badge badge-success">Paid</span>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => handlePay(o._id)} disabled={payingId === o._id} className="btn-primary">
                  {payingId === o._id ? "Redirecting…" : "Pay with Flutterwave"}
                </button>
                <button
                  onClick={() => handleSimulatePay(o._id)}
                  disabled={payingId === o._id}
                  className="btn-secondary !text-xs"
                >
                  {payingId === o._id ? "Working…" : "Simulate payment (demo)"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
