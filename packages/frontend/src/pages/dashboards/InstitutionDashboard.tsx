import { useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import ManagePrograms from "./ManagePrograms";
import ReviewApplications from "./ReviewApplications";

type Tab = "programs" | "applications";

export default function InstitutionDashboard() {
  const [tab, setTab] = useState<Tab>("applications");

  return (
    <DashboardShell title="Institution dashboard">
      <div className="flex gap-6 mb-8 text-sm border-b border-line overflow-x-auto">
        <button onClick={() => setTab("applications")} className={`pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "applications" ? "text-brand border-b-2 border-brand" : "text-muted"}`}>
          Applications received
        </button>
        <button onClick={() => setTab("programs")} className={`pb-3 font-semibold shrink-0 whitespace-nowrap ${tab === "programs" ? "text-brand border-b-2 border-brand" : "text-muted"}`}>
          My programs
        </button>
      </div>
      {tab === "applications" ? <ReviewApplications /> : <ManagePrograms />}
    </DashboardShell>
  );
}
