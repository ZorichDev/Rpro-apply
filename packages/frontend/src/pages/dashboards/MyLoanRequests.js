import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchMyLoanRequests } from "../../api/loanRequests";
import { formatCurrency } from "../../utils/currency";
export default function MyLoanRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchMyLoanRequests()
            .then(({ data }) => setRequests(data.loanRequests))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (requests.length === 0) {
        return _jsx("p", { className: "text-muted text-sm", children: "No loan requests yet \u2014 apply from the Add-on services tab." });
    }
    return (_jsx("div", { className: "max-w-2xl grid gap-3", children: requests.map((r) => (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-center justify-between flex-wrap gap-2", children: [_jsx("p", { className: "font-bold", children: r.serviceId?.title ?? "Deleted service" }), _jsx("span", { className: `badge ${r.status === "approved" ? "badge-success" : r.status === "rejected" ? "badge-brand" : "badge-amber"}`, children: r.status })] }), _jsxs("p", { className: "text-sm text-muted mt-1", children: [r.vendorId?.companyName ?? "Unknown vendor", " \u00B7 Requested ", formatCurrency(r.amountRequested, r.currency)] }), _jsx("p", { className: "text-sm text-ink2 mt-2", children: r.purpose }), r.reviewNote && _jsxs("p", { className: "text-sm text-muted mt-2 italic", children: ["\"", r.reviewNote, "\""] })] }, r._id))) }));
}
