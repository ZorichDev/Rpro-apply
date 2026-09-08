import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchServices } from "../../api/services";
import { createOrderRequest } from "../../api/orders";
import { createLoanRequestRequest } from "../../api/loanRequests";
import { formatCurrency } from "../../utils/currency";
export default function BrowseServices() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingId, setAddingId] = useState(null);
    const [feedback, setFeedback] = useState(null);
    // Loan application modal state — separate from the plain "add a
    // service" flow, since a loan isn't something you buy up front.
    const [loanTarget, setLoanTarget] = useState(null);
    const [loanForm, setLoanForm] = useState({ amountRequested: "", purpose: "", monthlyIncome: "" });
    const [submittingLoan, setSubmittingLoan] = useState(false);
    const [loanError, setLoanError] = useState(null);
    useEffect(() => {
        fetchServices()
            .then(({ data }) => setServices(data.services))
            .finally(() => setLoading(false));
    }, []);
    async function handleAdd(service) {
        setAddingId(service._id);
        setFeedback(null);
        try {
            await createOrderRequest(service._id);
            setFeedback(`Added ${service.title} to My Orders — pay from there to confirm.`);
        }
        catch (err) {
            setFeedback(err?.response?.data?.message ?? "Could not add service.");
        }
        finally {
            setAddingId(null);
        }
    }
    async function handleSubmitLoan(e) {
        e.preventDefault();
        if (!loanTarget)
            return;
        setLoanError(null);
        setSubmittingLoan(true);
        try {
            await createLoanRequestRequest({
                serviceId: loanTarget._id,
                amountRequested: Number(loanForm.amountRequested),
                purpose: loanForm.purpose,
                monthlyIncome: Number(loanForm.monthlyIncome),
            });
            setFeedback(`Loan request sent to ${loanTarget.vendorId.companyName} — check My Loan Requests for a decision.`);
            setLoanTarget(null);
            setLoanForm({ amountRequested: "", purpose: "", monthlyIncome: "" });
        }
        catch (err) {
            setLoanError(err?.response?.data?.message ?? "Could not submit loan request.");
        }
        finally {
            setSubmittingLoan(false);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading services\u2026" });
    if (services.length === 0) {
        return _jsx("p", { className: "text-muted text-sm", children: "No services listed yet \u2014 check back soon." });
    }
    return (_jsxs("div", { className: "max-w-2xl space-y-4", children: [feedback && _jsx("p", { className: "text-sm text-success font-medium", children: feedback }), _jsx("div", { className: "grid gap-3", children: services.map((s) => {
                    const isLoan = s.category === "loans";
                    return (_jsxs("div", { className: "card !p-5 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: s.title }), _jsxs("p", { className: "text-sm text-muted", children: [s.vendorId.companyName, " \u00B7 ", s.category.replace("_", " "), !isLoan && ` · ${formatCurrency(s.priceAmount, s.currency)}`, isLoan && ` · up to ${formatCurrency(s.priceAmount, s.currency)}`] })] }), isLoan ? (_jsx("button", { onClick: () => setLoanTarget(s), className: "btn-primary", children: "Apply for loan" })) : (_jsx("button", { onClick: () => handleAdd(s), disabled: addingId === s._id, className: "btn-primary", children: addingId === s._id ? "Adding…" : "Add" }))] }, s._id));
                }) }), loanTarget && (_jsx("div", { className: "fixed inset-0 bg-ink/50 flex items-center justify-center px-4", onClick: () => setLoanTarget(null), children: _jsxs("form", { onSubmit: handleSubmitLoan, onClick: (e) => e.stopPropagation(), className: "card w-full max-w-md space-y-4 relative", children: [_jsx("button", { type: "button", onClick: () => setLoanTarget(null), "aria-label": "Close", className: "absolute top-5 right-5 text-muted hover:text-ink text-lg leading-none", children: "\u00D7" }), _jsxs("h2", { className: "font-display font-black text-xl pr-6", children: ["Apply for ", loanTarget.title] }), _jsxs("p", { className: "text-sm text-muted -mt-2", children: ["from ", loanTarget.vendorId.companyName] }), _jsxs("div", { children: [_jsxs("label", { className: "field-label", children: ["Amount requested (", loanTarget.currency, ")"] }), _jsx("input", { required: true, type: "number", min: "0", className: "field-input", value: loanForm.amountRequested, onChange: (e) => setLoanForm({ ...loanForm, amountRequested: e.target.value }) })] }), _jsxs("div", { children: [_jsxs("label", { className: "field-label", children: ["Monthly income (", loanTarget.currency, ")"] }), _jsx("input", { required: true, type: "number", min: "0", className: "field-input", value: loanForm.monthlyIncome, onChange: (e) => setLoanForm({ ...loanForm, monthlyIncome: e.target.value }) })] }), _jsxs("div", { children: [_jsx("label", { className: "field-label", children: "What's this loan for?" }), _jsx("textarea", { required: true, minLength: 10, rows: 3, placeholder: "e.g. covering tuition for my first semester", className: "field-input", value: loanForm.purpose, onChange: (e) => setLoanForm({ ...loanForm, purpose: e.target.value }) })] }), loanError && _jsx("p", { className: "text-sm text-brand", children: loanError }), _jsxs("div", { className: "flex justify-end gap-3", children: [_jsx("button", { type: "button", onClick: () => setLoanTarget(null), className: "btn-secondary", children: "Cancel" }), _jsx("button", { type: "submit", disabled: submittingLoan, className: "btn-primary", children: submittingLoan ? "Submitting…" : "Submit application" })] })] }) }))] }));
}
