import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchMyOrders, initiateCheckoutRequest, payOrderRequest } from "../../api/orders";
import { formatCurrency } from "../../utils/currency";
export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [payingId, setPayingId] = useState(null);
    const [error, setError] = useState(null);
    function load() {
        fetchMyOrders()
            .then(({ data }) => setOrders(data.orders))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handlePay(id) {
        setPayingId(id);
        setError(null);
        try {
            const { data } = await initiateCheckoutRequest(id);
            // Full-page redirect to Flutterwave's hosted checkout — this leaves
            // the app entirely and comes back to /orders/callback afterward.
            window.location.href = data.paymentLink;
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Could not start payment.");
            setPayingId(null);
        }
    }
    // DEMO ONLY: bypasses Flutterwave entirely, for testing the order →
    // commission → bonus flow before a real gateway key is configured.
    // Remove this button once FLW_SECRET_KEY is a real key.
    async function handleSimulatePay(id) {
        setPayingId(id);
        setError(null);
        try {
            await payOrderRequest(id);
            load();
        }
        catch (err) {
            setError(err?.response?.data?.message ?? "Could not simulate payment.");
        }
        finally {
            setPayingId(null);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (orders.length === 0) {
        return _jsx("p", { className: "text-muted text-sm", children: "No services added yet. Browse services to get started." });
    }
    return (_jsxs("div", { className: "max-w-2xl space-y-3", children: [_jsx("p", { className: "text-xs text-muted bg-soft rounded-lg px-3 py-2", children: "\"Pay with Flutterwave\" uses your real (currently placeholder) API key and will fail until you add a real one. \"Simulate payment (demo)\" skips Flutterwave entirely so you can test the rest of the flow right now." }), error && _jsx("p", { className: "text-sm text-brand", children: error }), _jsx("div", { className: "grid gap-3", children: orders.map((o) => (_jsxs("div", { className: "card !p-5 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: o.serviceId?.title ?? "Deleted service" }), _jsxs("p", { className: "text-sm text-muted", children: [o.vendorId?.companyName ?? "Unknown vendor", " \u00B7 ", formatCurrency(o.amount, o.currency)] })] }), o.status === "paid" ? (_jsx("span", { className: "badge badge-success", children: "Paid" })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => handlePay(o._id), disabled: payingId === o._id, className: "btn-primary", children: payingId === o._id ? "Redirecting…" : "Pay with Flutterwave" }), _jsx("button", { onClick: () => handleSimulatePay(o._id), disabled: payingId === o._id, className: "btn-secondary !text-xs", children: payingId === o._id ? "Working…" : "Simulate payment (demo)" })] }))] }, o._id))) })] }));
}
