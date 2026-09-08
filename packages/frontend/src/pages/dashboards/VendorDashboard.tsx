import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import ManageServices from "./ManageServices";
import ReceivedLoanRequests from "./ReceivedLoanRequests";

type Tab = "services" | "loans";

export default function VendorDashboard() {
  const [tab, setTab] = useState<Tab>("services");

  return (
    <DashboardShell title="Vendor dashboard">
      <div className="flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto">
        <button
          onClick={() => setTab("services")}
          className={`pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "services" ? "text-brand border-b-2 border-brand" : "text-muted"}`}
        >
          My services
        </button>
        <button
          onClick={() => setTab("loans")}
          className={`pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "loans" ? "text-brand border-b-2 border-brand" : "text-muted"}`}
        >
          Loan requests
        </button>
      </div>
      {tab === "services" ? <ManageServices /> : <ReceivedLoanRequests />}
    </DashboardShell>
  );
}
