import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { fetchInstitutionsForReview, verifyInstitutionRequest } from "../api/admin";
export default function AdminInstitutions() {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState(null);
    function load() {
        fetchInstitutionsForReview()
            .then(({ data }) => setInstitutions(data.institutions))
            .finally(() => setLoading(false));
    }
    useEffect(load, []);
    async function handleVerify(id) {
        setBusyId(id);
        try {
            await verifyInstitutionRequest(id);
            load();
        }
        finally {
            setBusyId(null);
        }
    }
    if (loading)
        return _jsx("p", { className: "text-muted text-sm", children: "Loading\u2026" });
    if (institutions.length === 0)
        return _jsx("p", { className: "text-muted text-sm", children: "No institutions registered yet." });
    return (_jsx("div", { className: "max-w-2xl grid gap-3", children: institutions.map((inst) => (_jsxs("div", { className: "card !p-5 flex items-center justify-between flex-wrap gap-2", children: [_jsxs("div", { children: [_jsx("p", { className: "font-bold", children: inst.institutionName ?? "(profile incomplete)" }), _jsxs("p", { className: "text-sm text-muted", children: [inst.email, " ", inst.country && `· ${inst.country}`, " ", inst.institutionType && `· ${inst.institutionType}`] })] }), inst.accreditationVerified ? (_jsx("span", { className: "badge badge-success", children: "Verified" })) : (_jsx("button", { onClick: () => handleVerify(inst._id), disabled: busyId === inst._id || !inst.isProfileComplete, title: !inst.isProfileComplete ? "Institution hasn't completed their profile yet" : undefined, className: "btn-secondary !text-xs", children: busyId === inst._id ? "Verifying…" : "Verify accreditation" }))] }, inst._id))) }));
}
