import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import AdminShell from "../components/AdminShell";
import AdminOverview from "./AdminOverview";
import AdminInstitutions from "./AdminInstitutions";
import AdminUsers from "./AdminUsers";
import AdminPartners from "./AdminPartners";
import AdminOrders from "./AdminOrders";
import AdminBonuses from "./AdminBonuses";
import AdminAuditLog from "./AdminAuditLog";
const TABS = [
    { key: "overview", label: "Overview" },
    { key: "institutions", label: "Institutions" },
    { key: "users", label: "Users" },
    { key: "partners", label: "Partners" },
    { key: "orders", label: "Orders" },
    { key: "bonuses", label: "Bonuses" },
    { key: "audit", label: "Audit log" },
];
export default function Dashboard() {
    const [tab, setTab] = useState("overview");
    const content = {
        overview: _jsx(AdminOverview, {}),
        institutions: _jsx(AdminInstitutions, {}),
        users: _jsx(AdminUsers, {}),
        partners: _jsx(AdminPartners, {}),
        orders: _jsx(AdminOrders, {}),
        bonuses: _jsx(AdminBonuses, {}),
        audit: _jsx(AdminAuditLog, {}),
    }[tab];
    return (_jsxs(AdminShell, { title: "Admin dashboard", children: [_jsx("div", { className: "flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto", children: TABS.map((t) => (_jsx("button", { onClick: () => setTab(t.key), className: `pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === t.key ? "text-brand border-b-2 border-brand" : "text-muted"}`, children: t.label }, t.key))) }), content] }));
}
