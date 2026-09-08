import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import BrowsePrograms from "./BrowsePrograms";
import MyApplications from "./MyApplications";
import BrowseServices from "./BrowseServices";
import MyOrders from "./MyOrders";
import MyDocuments from "./MyDocuments";
import MyLoanRequests from "./MyLoanRequests";
const TABS = [
    { key: "browse", label: "Browse programs" },
    { key: "applications", label: "My applications" },
    { key: "documents", label: "Documents" },
    { key: "services", label: "Add-on services" },
    { key: "orders", label: "My orders" },
    { key: "loans", label: "Loan requests" },
];
export default function StudentDashboard() {
    const [tab, setTab] = useState("browse");
    const content = {
        browse: _jsx(BrowsePrograms, {}),
        applications: _jsx(MyApplications, {}),
        documents: _jsx(MyDocuments, {}),
        services: _jsx(BrowseServices, {}),
        orders: _jsx(MyOrders, {}),
        loans: _jsx(MyLoanRequests, {}),
    }[tab];
    return (_jsxs(DashboardShell, { title: "Student dashboard", children: [_jsx("div", { className: "flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto", children: TABS.map((t) => (_jsx("button", { onClick: () => setTab(t.key), className: `pb-3 font-semibold whitespace-nowrap shrink-0 ${tab === t.key ? "text-brand border-b-2 border-brand" : "text-muted"}`, children: t.label }, t.key))) }), content] }));
}
