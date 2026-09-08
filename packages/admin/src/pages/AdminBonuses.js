import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchAllBonuses, markBonusPaidRequest } from "../api/admin";
import { formatCurrency } from "../utils/currency";
export default function AdminBonuses() {
    const [bonuses, setBonuses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    function load() {
        fetchAllBonuses()
            .then(({ data }) => setBonuses(data.bonuses))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleMarkPaid(id) {
        setBusyId(id);
        try {
            await markBonusPaidRequest(id);
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (bonuses.length === 0)
        return _jsx("p", { className: "text-muted text-sm", children: "No success bonuses owed yet." });
    return (_jsx("div", { className: "max-w-3xl grid gap-3", children: bonuses.map((b) => (_jsxs("div", { className: "card !p-5 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: b.partnerId.email }), _jsxs("p", { className: "text-sm text-muted", children: ["Student: ", b.studentId.email, " \u00B7 ", formatCurrency(b.amountNgn, "NGN")] })] }), b.status === "paid" ? (_jsx("span", { className: "badge badge-success", children: "Paid" })) : (_jsx("button", { onClick: () => handleMarkPaid(b._id), disabled: busyId === b._id, className: "btn-secondary !text-xs", children: busyId === b._id ? "Marking…" : "Mark as paid" }))] }, b._id))) }));
}
