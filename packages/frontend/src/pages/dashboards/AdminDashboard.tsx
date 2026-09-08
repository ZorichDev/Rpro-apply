import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import AdminOverview from "./AdminOverview";
import AdminInstitutions from "./AdminInstitutions";
import AdminUsers from "./AdminUsers";
import AdminAuditLog from "./AdminAuditLog";
import AdminPartners from "./AdminPartners";
import AdminOrders from "./AdminOrders";
import AdminBonuses from "./AdminBonuses";

type Tab = "overview" | "institutions" | "users" | "partners" | "orders" | "bonuses" | "audit";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "institutions", label: "Institutions" },
  { key: "users", label: "Users" },
  { key: "partners", label: "Partners" },
  { key: "orders", label: "Orders" },
  { key: "bonuses", label: "Bonuses" },
  { key: "audit", label: "Audit log" },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("overview");

  const content = {
    overview: <AdminOverview />,
    institutions: <AdminInstitutions />,
    users: <AdminUsers />,
    partners: <AdminPartners />,
    orders: <AdminOrders />,
    bonuses: <AdminBonuses />,
    audit: <AdminAuditLog />,
  }[tab];

  return (
    <DashboardShell title="Admin dashboard">
      <div className="flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === t.key ? "text-brand border-b-2 border-brand" : "text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {content}
    </DashboardShell>
  );
}
