import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchPrograms } from "../../api/programs";
import { submitApplication } from "../../api/applications";
import { formatCurrency } from "../../utils/currency";
export default function BrowsePrograms() {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applyingTo, setApplyingTo] = useState(null);
    const [statement, setStatement] = useState("");
    const [feedback, setFeedback] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    useEffect(() => {
        fetchPrograms()
            .then(({ data }) => setPrograms(data.programs))
            .finally(() => setLoading(false));
    }, []);
    async function handleApply(e) {
        e.preventDefault();
        if (!applyingTo)
            return;
        setSubmitting(true);
        setFeedback(null);
        try {
            await submitApplication({ programId: applyingTo._id, personalStatement: statement });
            setFeedback(`Application submitted to ${applyingTo.institutionId.institutionName}.`);
            setApplyingTo(null);
            setStatement("");
        }
        catch (err) {
            setFeedback(err?.response?.data?.message ?? "Could not submit application.");
        }
        finally {
            setSubmitting(false);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading programs\u2026" });
    if (programs.length === 0) {
        return _jsx("p", { className: "text-muted text-sm", children: "No programs listed yet \u2014 check back soon." });
    }
    return (_jsxs("div", { className: "max-w-2xl", children: [feedback && _jsx("p", { className: "text-sm text-success font-medium mb-4", children: feedback }), _jsx("div", { className: "grid gap-3", children: programs.map((p) => (_jsxs("div", { className: "card flex items-center justify-between flex-wrap gap-2 !p-5", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: p.title }), _jsxs("p", { className: "text-sm text-muted", children: [p.institutionId.institutionName, " \u00B7 ", p.country, " \u00B7 ", p.level, " \u00B7 ", formatCurrency(p.tuitionAmount, p.currency), "/yr"] })] }), _jsx("button", { onClick: () => setApplyingTo(p), className: "btn-primary", children: "Apply" })] }, p._id))) }), applyingTo && (_jsx("div", { className: "fixed inset-0 bg-ink/50 flex items-center justify-center px-4", onClick: () => setApplyingTo(null), children: _jsxs("form", { onSubmit: handleApply, onClick: (e) => e.stopPropagation(), className: "card w-full max-w-md space-y-4 relative", children: [_jsx("button", { type: "button", onClick: () => setApplyingTo(null), "aria-label": "Close", className: "absolute top-5 right-5 text-muted hover:text-ink text-lg leading-none", children: "\u00D7" }), _jsxs("h2", { className: "font-display font-black text-xl pr-6", children: ["Apply to ", applyingTo.title] }), _jsx("textarea", { required: true, minLength: 50, rows: 5, placeholder: "Personal statement (min. 50 characters)", value: statement, onChange: (e) => setStatement(e.target.value), className: "field-input" }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => setApplyingTo(null), className: "btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: submitting, className: "btn-primary", children: submitting ? "Submitting…" : "Submit" })] })] }) }))] }));
}
