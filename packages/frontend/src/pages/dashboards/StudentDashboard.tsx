import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import BrowsePrograms from "./BrowsePrograms";
import MyApplications from "./MyApplications";
import BrowseServices from "./BrowseServices";
import MyOrders from "./MyOrders";
import MyDocuments from "./MyDocuments";
import MyLoanRequests from "./MyLoanRequests";

type Tab = "browse" | "applications" | "documents" | "services" | "orders" | "loans";

const TABS: { key: Tab; label: string }[] = [
  { key: "browse", label: "Browse programs" },
  { key: "applications", label: "My applications" },
  { key: "documents", label: "Documents" },
  { key: "services", label: "Add-on services" },
  { key: "orders", label: "My orders" },
  { key: "loans", label: "Loan requests" },
];

export default function StudentDashboard() {
  const [tab, setTab] = useState<Tab>("browse");

  const content = {
    browse: <BrowsePrograms />,
    applications: <MyApplications />,
    documents: <MyDocuments />,
    services: <BrowseServices />,
    orders: <MyOrders />,
    loans: <MyLoanRequests />,
  }[tab];

  return (
    <DashboardShell title="Student dashboard">
      <div className="flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-3 font-semibold whitespace-nowrap shrink-0 ${tab === t.key ? "text-brand border-b-2 border-brand" : "text-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>
      {content}
    </DashboardShell>
  );
}
