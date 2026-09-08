import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchPartnerEarnings } from "../../api/admin";
import { formatCurrency } from "../../utils/currency";
export default function AdminPartners() {
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchPartnerEarnings()
            .then(({ data }) => setPartners(data.partners))
            .finally(() => setLoading(false));
    }, []);
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (partners.length === 0)
        return _jsx("p", { className: "text-muted text-sm", children: "No recruitment partners registered yet." });
    return (_jsx("div", { className: "max-w-3xl grid gap-3", children: partners.map((p) => {
            const earnings = Object.entries(p.earningsByCurrency);
            const hasBankDetails = p.bankName && p.accountNumber && p.accountName;
            return (_jsxs("div", { className: "card !p-5", children: [_jsxs("div", { className: "flex items-start justify-between flex-wrap gap-3", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: p.email }), _jsxs("p", { className: "text-xs text-muted", children: ["Code: ", p.referralCode] })] }), _jsx("div", { className: "flex gap-2 flex-wrap justify-end", children: earnings.length === 0 ? (_jsx("span", { className: "badge badge-muted", children: "No earnings yet" })) : (earnings.map(([currency, amount]) => (_jsx("span", { className: "badge badge-success", children: formatCurrency(amount, currency) }, currency)))) })] }), _jsx("div", { className: "mt-3 pt-3 border-t border-line", children: hasBankDetails ? (_jsxs("p", { className: "text-sm text-ink2", children: [p.bankName, " \u00B7 ", p.accountNumber, " \u00B7 ", p.accountName] })) : (_jsx("p", { className: "text-xs text-muted italic", children: "No bank details on file yet." })) })] }, p.id));
        }) }));
}
