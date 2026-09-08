import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import DashboardShell from "../../components/DashboardShell";
import { fetchMe, fetchMyReferrals, updateProfileRequest } from "../../api/users";
import { fetchMyEarnings, fetchMyBonuses, downloadMonthlyReport } from "../../api/orders";
import { formatCurrency } from "../../utils/currency";
function formatDateTime(iso) {
    return new Date(iso).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}
function currentMonthValue() {
    return new Date().toISOString().slice(0, 7); // YYYY-MM
}
export default function PartnerDashboard() {
    const [referralCode, setReferralCode] = useState(null);
    const [referrals, setReferrals] = useState([]);
    const [earnings, setEarnings] = useState({
        orders: [],
        totalsByCurrency: {},
    });
    const [bonuses, setBonuses] = useState({ bonuses: [], totalNgn: 0 });
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
        if (!referralUrl)
            return;
        navigator.clipboard.writeText(referralUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }
    async function handleSaveBank(e) {
        e.preventDefault();
        setSavingBank(true);
        setBankSaved(false);
        try {
            await updateProfileRequest(bankForm);
            setBankSaved(true);
            setTimeout(() => setBankSaved(false), 2500);
        }
        finally {
            setSavingBank(false);
        }
    }
    async function handleDownloadReport() {
        setDownloadingReport(true);
        try {
            await downloadMonthlyReport(reportMonth);
        }
        finally {
            setDownloadingReport(false);
        }
    }
    const currencyTotals = Object.entries(earnings.totalsByCurrency);
    return (_jsx(DashboardShell, { title: "Referral overview", children: _jsxs("div", { className: "max-w-2xl space-y-8", children: [_jsxs("div", { className: "card !bg-ink !text-white text-center !p-8", children: [_jsx("p", { className: "text-xs uppercase tracking-widest text-white/50 font-bold mb-3", children: "Your Personal Referral Link" }), referralUrl ? (_jsxs("div", { className: "inline-flex items-center gap-3 bg-white/5 border border-dashed border-white/20 rounded-xl px-5 py-3 flex-wrap justify-center", children: [_jsx("span", { className: "text-sm font-mono break-all", children: referralUrl }), _jsx("button", { onClick: handleCopy, className: "bg-brand text-white rounded-md px-3 py-1 text-xs font-bold shrink-0", children: copied ? "Copied!" : "Copy" })] })) : (_jsx("p", { className: "text-sm text-white/60", children: "Loading your link\u2026" }))] }), _jsxs("div", { children: [_jsx("p", { className: "font-bold mb-3", children: "Payout bank details" }), _jsxs("form", { onSubmit: handleSaveBank, className: "card space-y-3 max-w-md", children: [_jsx("input", { placeholder: "Bank name", className: "field-input", value: bankForm.bankName, onChange: (e) => setBankForm({ ...bankForm, bankName: e.target.value }) }), _jsx("input", { placeholder: "Account number", className: "field-input", value: bankForm.accountNumber, onChange: (e) => setBankForm({ ...bankForm, accountNumber: e.target.value }) }), _jsx("input", { placeholder: "Account name", className: "field-input", value: bankForm.accountName, onChange: (e) => setBankForm({ ...bankForm, accountName: e.target.value }) }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { type: "submit", disabled: savingBank, className: "btn-primary !text-xs", children: savingBank ? "Saving…" : "Save bank details" }), bankSaved && _jsx("span", { className: "text-xs text-success font-semibold", children: "Saved" })] })] })] }), _jsxs("div", { children: [_jsxs("p", { className: "font-bold mb-3", children: ["Referred signups ", referrals.length > 0 && `(${referrals.length})`] }), loading ? (_jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" })) : referrals.length === 0 ? (_jsx("p", { className: "text-muted text-sm", children: "No one's signed up through your link yet. Share it to start earning." })) : (_jsx("div", { className: "grid gap-3", children: referrals.map((r) => (_jsxs("div", { className: "card !p-4 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: r.email }), _jsxs("p", { className: "text-xs text-muted", children: [r.role.replace("_", " "), " \u00B7 ", formatDateTime(r.createdAt)] })] }), _jsx("span", { className: `badge ${r.isProfileComplete ? "badge-success" : "badge-muted"}`, children: r.isProfileComplete ? "Active" : "Pending profile" })] }, r._id))) }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline justify-between mb-3 flex-wrap gap-2", children: [_jsx("p", { className: "font-bold", children: "Commission earned" }), _jsx("div", { className: "flex gap-3 flex-wrap", children: currencyTotals.length === 0 ? (_jsx("span", { className: "font-display font-black text-2xl text-brand", children: "\u2014" })) : (currencyTotals.map(([currency, total]) => (_jsx("span", { className: "font-display font-black text-2xl text-brand", children: formatCurrency(total, currency) }, currency)))) })] }), loading ? (_jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" })) : earnings.orders.length === 0 ? (_jsx("p", { className: "text-muted text-sm", children: "No paid orders yet. You earn 7% when a referred student pays for a vendor service." })) : (_jsx("div", { className: "grid gap-3", children: earnings.orders.map((o) => (_jsxs("div", { className: "card !p-4 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: o.serviceId.title }), _jsxs("p", { className: "text-xs text-muted", children: [o.studentId.email, " \u00B7 Paid ", formatDateTime(o.paidAt)] })] }), _jsxs("span", { className: "badge badge-success", children: ["+", formatCurrency(o.commissionAmount, o.currency)] })] }, o._id))) }))] }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-baseline justify-between mb-3 flex-wrap gap-2", children: [_jsx("p", { className: "font-bold", children: "Study-abroad success bonus" }), _jsx("span", { className: "font-display font-black text-2xl text-brand", children: formatCurrency(bonuses.totalNgn, "NGN") })] }), loading ? (_jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" })) : bonuses.bonuses.length === 0 ? (_jsx("p", { className: "text-muted text-sm", children: "No bonuses yet. You earn \u20A6250,000 when a referred student's application is accepted." })) : (_jsx("div", { className: "grid gap-3", children: bonuses.bonuses.map((b) => (_jsxs("div", { className: "card !p-4 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold text-sm", children: b.studentId.email }), _jsxs("p", { className: "text-xs text-muted", children: ["Accepted ", formatDateTime(b.createdAt)] })] }), _jsxs("span", { className: `badge ${b.status === "paid" ? "badge-success" : "badge-amber"}`, children: [b.status === "paid" ? "Paid" : "Pending payout", " \u00B7 ", formatCurrency(b.amountNgn, "NGN")] })] }, b._id))) }))] }), _jsxs("div", { children: [_jsx("p", { className: "font-bold mb-3", children: "Download a monthly report" }), _jsxs("div", { className: "card !p-5 flex items-center gap-3 flex-wrap", children: [_jsx("input", { type: "month", value: reportMonth, onChange: (e) => setReportMonth(e.target.value), className: "field-input !w-auto" }), _jsx("button", { onClick: handleDownloadReport, disabled: downloadingReport, className: "btn-primary !text-xs", children: downloadingReport ? "Preparing…" : "Download CSV" })] })] })] }) }));
}
