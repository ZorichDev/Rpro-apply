import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyCheckoutRequest } from "../../api/orders";

export default function OrderCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const flwStatus = searchParams.get("status");
    const transactionId = searchParams.get("transaction_id");
    const txRef = searchParams.get("tx_ref");

    // Flutterwave itself reports "cancelled" if the student backs out of
    // checkout — no point calling verify in that case.
    if (flwStatus === "cancelled") {
      setStatus("error");
      setMessage("Payment was cancelled.");
      return;
    }

    if (!transactionId || !txRef) {
      setStatus("error");
      setMessage("Missing payment details in the redirect.");
      return;
    }

    verifyCheckoutRequest(transactionId, txRef)
      .then(() => setStatus("success"))
      .catch((err) => {
        setStatus("error");
        setMessage(err?.response?.data?.message ?? "Could not confirm payment.");
      });
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="card w-full max-w-sm text-center">
        {status === "loading" && <p className="text-muted text-sm">Confirming your payment…</p>}
        {status === "success" && (
          <>
            <h1 className="font-display font-black text-2xl tracking-tight mb-2">Payment confirmed</h1>
            <p className="text-muted text-sm mb-6">Your order is marked as paid.</p>
            <Link to="/student" className="btn-primary inline-block">Back to dashboard →</Link>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="font-display font-black text-2xl tracking-tight mb-2">Payment not confirmed</h1>
            <p className="text-muted text-sm mb-6">{message}</p>
            <Link to="/student" className="btn-primary inline-block">Back to dashboard →</Link>
          </>
        )}
      </div>
    </main>
  );
}
