import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import ManagePrograms from "./ManagePrograms";
import ReviewApplications from "./ReviewApplications";
export default function InstitutionDashboard() {
    const [tab, setTab] = useState("applications");
    return (_jsxs(DashboardShell, { title: "Institution dashboard", children: [_jsxs("div", { className: "flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto", children: [_jsx("button", { onClick: () => setTab("applications"), className: `pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "applications" ? "text-brand border-b-2 border-brand" : "text-muted"}`, children: "Applications received" }), _jsx("button", { onClick: () => setTab("programs"), className: `pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "programs" ? "text-brand border-b-2 border-brand" : "text-muted"}`, children: "My programs" })] }), tab === "applications" ? _jsx(ReviewApplications, {}) : _jsx(ManagePrograms, {})] }));
}
