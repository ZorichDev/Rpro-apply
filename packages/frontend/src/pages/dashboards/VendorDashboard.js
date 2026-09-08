import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import ManageServices from "./ManageServices";
import ReceivedLoanRequests from "./ReceivedLoanRequests";
export default function VendorDashboard() {
    const [tab, setTab] = useState("services");
    return (_jsxs(DashboardShell, { title: "Vendor dashboard", children: [_jsxs("div", { className: "flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto", children: [_jsx("button", { onClick: () => setTab("services"), className: `pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "services" ? "text-brand border-b-2 border-brand" : "text-muted"}`, children: "My services" }), _jsx("button", { onClick: () => setTab("loans"), className: `pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "loans" ? "text-brand border-b-2 border-brand" : "text-muted"}`, children: "Loan requests" })] }), tab === "services" ? _jsx(ManageServices, {}) : _jsx(ReceivedLoanRequests, {})] }));
}
