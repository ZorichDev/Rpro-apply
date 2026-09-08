import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchAdminStats } from "../api/admin";
import { formatCurrency } from "../utils/currency";
export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchAdminStats()
            .then(({ data }) => setStats(data))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (!stats)
        return _jsx("p", { className: "text-muted text-sm", children: "Could not load platform stats." });
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
    return (_jsxs("div", { className: "max-w-4xl space-y-8", children: [_jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4", children: countCards.map((c) => (_jsxs("div", { className: "card !p-5", children: [_jsx("p", { className: "text-xs text-muted mb-1", children: c.label }), _jsx("p", { className: "font-display font-black text-2xl", children: c.value })] }, c.label))) }), _jsxs("div", { className: "grid sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "card !p-5", children: [_jsx("p", { className: "text-xs text-muted mb-2", children: "Total revenue by currency" }), revenueEntries.length === 0 ? (_jsx("p", { className: "text-sm text-muted", children: "No paid orders yet." })) : (_jsx("div", { className: "space-y-1", children: revenueEntries.map(([currency, amount]) => (_jsx("p", { className: "font-display font-black text-xl", children: formatCurrency(amount, currency) }, currency))) }))] }), _jsxs("div", { className: "card !p-5", children: [_jsx("p", { className: "text-xs text-muted mb-2", children: "Total commission owed by currency" }), commissionEntries.length === 0 ? (_jsx("p", { className: "text-sm text-muted", children: "No commission owed yet." })) : (_jsx("div", { className: "space-y-1", children: commissionEntries.map(([currency, amount]) => (_jsx("p", { className: "font-display font-black text-xl", children: formatCurrency(amount, currency) }, currency))) }))] })] })] }));
}
