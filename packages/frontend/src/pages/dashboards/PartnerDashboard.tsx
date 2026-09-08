import { useEffect, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { fetchMe, fetchMyReferrals, updateProfileRequest } from "../../api/users";
import { fetchMyEarnings, fetchMyBonuses, downloadMonthlyReport } from "../../api/orders";
import { formatCurrency } from "../../utils/currency";

interface Referral {
  _id: string;
  email: string;
  role: string;
  isProfileComplete: boolean;
  createdAt: string;
}

interface EarningOrder {
  _id: string;
  commissionAmount: number;
  currency: string;
  paidAt: string;
  studentId: { email: string };
  serviceId: { title: string };
}

interface Bonus {
  _id: string;
  amountNgn: number;
  status: string;
  createdAt: string;
  studentId: { email: string };
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function currentMonthValue(): string {
  return new Date().toISOString().slice(0, 7); // YYYY-MM
}

export default function PartnerDashboard() {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<{ orders: EarningOrder[]; totalsByCurrency: Record<string, number> }>({
    orders: [],
    totalsByCurrency: {},
  });
  const [bonuses, setBonuses] = useState<{ bonuses: Bonus[]; totalNgn: number }>({ bonuses: [], totalNgn: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Bank details form state
  const [bankForm, setBankForm] = useState({ bankName: "", accountNumber: "", accountName: "" });
  const [savingBank, setSavingBank] = useState(false);
  const [bankSaved, setBankSaved] = useState(false);

  const [reportMonth, setReportMonth] = useState(currentMonthValue());
  const [downloadingReport, setDownloadingReport] = useState(false);

  function load() {
    Promise.all([fetchMe(), fetchMyReferrals(), fetchMyEarnings(), fetchMyBonuses()])
      .then(([meRes, refRes, earnRes, bonusRes]) => {
        const user = meRes.data.user;
        setReferralCode(user.referralCode ?? null);
        setBankForm({
          bankName: user.bankName ?? "",
          accountNumber: user.accountNumber ?? "",
          accountName: user.accountName ?? "",
        });
        setReferrals(refRes.data.referrals);
        setEarnings(earnRes.data);
        setBonuses(bonusRes.data);
      })
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  const referralUrl = referralCode ? `${window.location.origin}/register?ref=${referralCode}` : null;

  function handleCopy() {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSaveBank(e: React.FormEvent) {
    e.preventDefault();
    setSavingBank(true);
    setBankSaved(false);
    try {
      await updateProfileRequest(bankForm);
      setBankSaved(true);
      setTimeout(() => setBankSaved(false), 2500);
    } finally {
      setSavingBank(false);
    }
  }

  async function handleDownloadReport() {
    setDownloadingReport(true);
    try {
      await downloadMonthlyReport(reportMonth);
    } finally {
      setDownloadingReport(false);
    }
  }

  const currencyTotals = Object.entries(earnings.totalsByCurrency);

  return (
    <DashboardShell title="Referral overview">
      <div className="max-w-2xl space-y-8">
        <div className="card !bg-ink !text-white text-center !p-8">
          <p className="text-xs uppercase tracking-widest text-white/50 font-bold mb-3">
            Your Personal Referral Link
          </p>
          {referralUrl ? (
            <div className="inline-flex items-center gap-3 bg-white/5 border border-dashed border-white/20 rounded-xl px-5 py-3 flex-wrap justify-center">
              <span className="text-sm font-mono break-all">{referralUrl}</span>
              <button onClick={handleCopy} className="bg-brand text-white rounded-md px-3 py-1 text-xs font-bold shrink-0">
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          ) : (
            <p className="text-sm text-white/60">Loading your link…</p>
          )}
        </div>

        {/* Bank details — editable anytime, used by admin to process payouts */}
        <div>
          <p className="font-bold mb-3">Payout bank details</p>
          <form onSubmit={handleSaveBank} className="card space-y-3 max-w-md">
            <input
              placeholder="Bank name"
              className="field-input"
              value={bankForm.bankName}
              onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
            />
            <input
              placeholder="Account number"
              className="field-input"
              value={bankForm.accountNumber}
              onChange={(e) => setBankForm({ ...bankForm, accountNumber: e.target.value })}
            />
            <input
              placeholder="Account name"
              className="field-input"
              value={bankForm.accountName}
              onChange={(e) => setBankForm({ ...bankForm, accountName: e.target.value })}
            />
            <div className="flex items-center gap-3">
              <button type="submit" disabled={savingBank} className="btn-primary !text-xs">
                {savingBank ? "Saving…" : "Save bank details"}
              </button>
              {bankSaved && <span className="text-xs text-success font-semibold">Saved</span>}
            </div>
          </form>
        </div>

        <div>
          <p className="font-bold mb-3">
            Referred signups {referrals.length > 0 && `(${referrals.length})`}
          </p>
          {loading ? (
            <p className="text-muted text-sm">Loading…</p>
          ) : referrals.length === 0 ? (
            <p className="text-muted text-sm">
              No one's signed up through your link yet. Share it to start earning.
            </p>
          ) : (
            <div className="grid gap-3">
              {referrals.map((r) => (
                <div key={r._id} className="card !p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-sm">{r.email}</p>
                    <p className="text-xs text-muted">
                      {r.role.replace("_", " ")} · {formatDateTime(r.createdAt)}
                    </p>
                  </div>
                  <span className={`badge ${r.isProfileComplete ? "badge-success" : "badge-muted"}`}>
                    {r.isProfileComplete ? "Active" : "Pending profile"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <p className="font-bold">Commission earned</p>
            {/* Shown per currency — a partner can earn in more than one
                currency depending on which country's vendors their
                referred students bought services from. */}
            <div className="flex gap-3 flex-wrap">
              {currencyTotals.length === 0 ? (
                <span className="font-display font-black text-2xl text-brand">—</span>
              ) : (
                currencyTotals.map(([currency, total]) => (
                  <span key={currency} className="font-display font-black text-2xl text-brand">
                    {formatCurrency(total, currency)}
                  </span>
                ))
              )}
            </div>
          </div>
          {loading ? (
            <p className="text-muted text-sm">Loading…</p>
          ) : earnings.orders.length === 0 ? (
            <p className="text-muted text-sm">
              No paid orders yet. You earn 7% when a referred student pays for a vendor service.
            </p>
          ) : (
            <div className="grid gap-3">
              {earnings.orders.map((o) => (
                <div key={o._id} className="card !p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-sm">{o.serviceId.title}</p>
                    <p className="text-xs text-muted">
                      {o.studentId.email} · Paid {formatDateTime(o.paidAt)}
                    </p>
                  </div>
                  <span className="badge badge-success">+{formatCurrency(o.commissionAmount, o.currency)}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Study-abroad success bonus — a flat ₦250,000 per referred
            student who gets accepted, separate from the percentage
            commission above. Always in Naira, per the company policy,
            regardless of which country the student applied to. */}
        <div>
          <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
            <p className="font-bold">Study-abroad success bonus</p>
            <span className="font-display font-black text-2xl text-brand">
              {formatCurrency(bonuses.totalNgn, "NGN")}
            </span>
          </div>
          {loading ? (
            <p className="text-muted text-sm">Loading…</p>
          ) : bonuses.bonuses.length === 0 ? (
            <p className="text-muted text-sm">
              No bonuses yet. You earn ₦250,000 when a referred student's application is accepted.
            </p>
          ) : (
            <div className="grid gap-3">
              {bonuses.bonuses.map((b) => (
                <div key={b._id} className="card !p-4 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <p className="font-bold text-sm">{b.studentId.email}</p>
                    <p className="text-xs text-muted">Accepted {formatDateTime(b.createdAt)}</p>
                  </div>
                  <span className={`badge ${b.status === "paid" ? "badge-success" : "badge-amber"}`}>
                    {b.status === "paid" ? "Paid" : "Pending payout"} · {formatCurrency(b.amountNgn, "NGN")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Monthly report — for reconciling a payout or resolving a
            dispute about what was actually earned in a given month. */}
        <div>
          <p className="font-bold mb-3">Download a monthly report</p>
          <div className="card !p-5 flex items-center gap-3 flex-wrap">
            <input
              type="month"
              value={reportMonth}
              onChange={(e) => setReportMonth(e.target.value)}
              className="field-input !w-auto"
            />
            <button onClick={handleDownloadReport} disabled={downloadingReport} className="btn-primary !text-xs">
              {downloadingReport ? "Preparing…" : "Download CSV"}
            </button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
