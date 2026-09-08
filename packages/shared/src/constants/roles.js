export const ROLES = {
    STUDENT: "student",
    INSTITUTION: "institution",
    VENDOR: "vendor",
    RECRUITMENT_PARTNER: "recruitment_partner",
    ADMIN: "admin",
};
export const APPLICATION_STATUS = {
    DRAFT: "draft",
    SUBMITTED: "submitted",
    UNDER_REVIEW: "under_review",
    OFFER_MADE: "offer_made",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    WITHDRAWN: "withdrawn",
};
export const INSTITUTION_TYPES = [
    "university",
    "polytechnic",
    "college",
    "apprenticeship",
];
export const SERVICE_CATEGORIES = [
    "test_prep",
    "loans",
    "visa",
    "housing",
    "insurance",
    "other",
];
export const ORDER_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    CANCELLED: "cancelled",
};
export const DOCUMENT_TYPES = ["waec", "jamb", "transcript", "id", "reference", "other"];
export const DOCUMENT_TYPE_LABELS = {
    waec: "WAEC Result",
    jamb: "JAMB Result",
    transcript: "Academic Transcript",
    id: "Government ID",
    reference: "Reference Letter",
    other: "Other",
};
// Currencies actually in use across the platform's core markets, plus USD
// as a neutral fallback. Commission and pricing follow whichever currency
// the underlying program/service was listed in — never forced into one
// currency regardless of which country is involved.
export const CURRENCIES = ["NGN", "GHS", "KES", "ZAR", "EGP", "RWF", "USD"];
export const CURRENCY_SYMBOLS = {
    NGN: "₦",
    GHS: "GH₵",
    KES: "KSh",
    ZAR: "R",
    EGP: "E£",
    RWF: "RF",
    USD: "$",
};
// Success bonuses are a flat company incentive-policy amount, always in
// Naira regardless of which country or currency the underlying
// transaction was in — distinct from the percentage-based order
// commission, which does follow the transaction's own currency.
export const STUDY_ABROAD_SUCCESS_BONUS_NGN = 250000;
export const BONUS_STATUS = {
    PENDING: "pending",
    PAID: "paid",
};
export const LOAN_REQUEST_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
};
