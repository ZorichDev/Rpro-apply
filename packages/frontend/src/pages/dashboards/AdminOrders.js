import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchPaidOrders, setOrderSelfCloseRequest } from "../../api/admin";
import { formatCurrency } from "../../utils/currency";
export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    function load() {
        fetchPaidOrders()
            .then(({ data }) => setOrders(data.orders))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleToggle(id, current) {
        setBusyId(id);
        try {
            await setOrderSelfCloseRequest(id, !current);
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (orders.length === 0)
        return _jsx("p", { className: "text-muted text-sm", children: "No commission-generating orders yet." });
    return (_jsxs("div", { className: "max-w-3xl space-y-3", children: [_jsx("p", { className: "text-xs text-muted bg-soft rounded-lg px-3 py-2", children: "Mark an order \"self-closed\" when the partner both referred the student AND closed the sale themselves \u2014 this retroactively applies the 10% tier instead of the default 7% referral-only rate." }), _jsx("div", { className: "grid gap-3", children: orders.map((o) => (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: o.serviceId.title }), _jsxs("p", { className: "text-sm text-muted", children: [o.studentId.email, " \u00B7 Partner: ", o.referralPartnerId.email] })] }), _jsxs("span", { className: "badge badge-success", children: [formatCurrency(o.commissionAmount, o.currency), " (", Math.round(o.commissionRate * 100), "%)"] })] }), _jsx("div", { className: "flex items-center gap-3 mt-4", children: _jsxs("label", { className: "flex items-center gap-2 text-xs font-semibold text-ink2 cursor-pointer", children: [_jsx("input", { type: "checkbox", checked: o.isSelfClose, disabled: busyId === o._id, onChange: () => handleToggle(o._id, o.isSelfClose) }), "Self-closed by partner (10%)"] }) })] }, o._id))) })] }));
}
