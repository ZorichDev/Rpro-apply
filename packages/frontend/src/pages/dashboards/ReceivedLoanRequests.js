import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchReceivedLoanRequests, decideLoanRequestRequest } from "../../api/loanRequests";
import { formatCurrency } from "../../utils/currency";
export default function ReceivedLoanRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    function load() {
        fetchReceivedLoanRequests()
            .then(({ data }) => setRequests(data.loanRequests))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleDecide(id, status) {
        setBusyId(id);
        try {
            await decideLoanRequestRequest(id, status);
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (requests.length === 0) {
        return _jsx("p", { className: "text-muted text-sm", children: "No loan requests received yet." });
    }
    return (_jsx("div", { className: "max-w-2xl grid gap-3", children: requests.map((r) => (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsx("p", { className: "font-bold", children: r.studentId ? `${r.studentId.firstName} ${r.studentId.lastName}` : "Unknown student" }), _jsx("span", { className: `badge ${r.status === "approved" ? "badge-success" : r.status === "rejected" ? "badge-brand" : "badge-amber"}`, children: r.status })] }), _jsxs("p", { className: "text-sm text-muted mt-1", children: [r.studentId?.email, " \u00B7 ", r.studentId?.country] }), _jsxs("div", { className: "grid grid-cols-2 gap-3 mt-3 py-3 border-y border-line text-sm", children: [_jsxs("div", { children: [_jsx("p", { className: "text-muted text-xs", children: "Amount requested" }), _jsx("p", { className: "font-bold", children: formatCurrency(r.amountRequested, r.currency) })] }), _jsxs("div", { children: [_jsx("p", { className: "text-muted text-xs", children: "Monthly income" }), _jsx("p", { className: "font-bold", children: formatCurrency(r.monthlyIncome, r.currency) })] })] }), _jsx("p", { className: "text-sm text-ink2 mt-3", children: r.purpose }), r.status === "pending" && (_jsxs("div", { className: "flex gap-3 mt-4", children: [_jsx("button", { onClick: () => handleDecide(r._id, "approved"), disabled: busyId === r._id, className: "btn-secondary !text-xs", children: "Approve" }), _jsx("button", { onClick: () => handleDecide(r._id, "rejected"), disabled: busyId === r._id, className: "text-xs font-semibold text-brand", children: "Reject" })] }))] }, r._id))) }));
}
