"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LOAN_REQUEST_STATUS = exports.BONUS_STATUS = exports.STUDY_ABROAD_SUCCESS_BONUS_NGN = exports.CURRENCY_SYMBOLS = exports.CURRENCIES = exports.DOCUMENT_TYPE_LABELS = exports.DOCUMENT_TYPES = exports.ORDER_STATUS = exports.SERVICE_CATEGORIES = exports.INSTITUTION_TYPES = exports.APPLICATION_STATUS = exports.ROLES = void 0;
exports.ROLES = {
    STUDENT: "student",
    INSTITUTION: "institution",
    VENDOR: "vendor",
    RECRUITMENT_PARTNER: "recruitment_partner",
    ADMIN: "admin",
};
exports.APPLICATION_STATUS = {
    DRAFT: "draft",
    SUBMITTED: "submitted",
    UNDER_REVIEW: "under_review",
    OFFER_MADE: "offer_made",
    ACCEPTED: "accepted",
    REJECTED: "rejected",
    WITHDRAWN: "withdrawn",
};
exports.INSTITUTION_TYPES = [
    "university",
    "polytechnic",
    "college",
    "apprenticeship",
];
exports.SERVICE_CATEGORIES = [
    "test_prep",
    "loans",
    "visa",
    "housing",
    "insurance",
    "other",
];
exports.ORDER_STATUS = {
    PENDING: "pending",
    PAID: "paid",
    CANCELLED: "cancelled",
};
exports.DOCUMENT_TYPES = ["waec", "jamb", "transcript", "id", "reference", "other"];
exports.DOCUMENT_TYPE_LABELS = {
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
exports.CURRENCIES = ["NGN", "GHS", "KES", "ZAR", "EGP", "RWF", "USD"];
exports.CURRENCY_SYMBOLS = {
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
exports.STUDY_ABROAD_SUCCESS_BONUS_NGN = 250000;
exports.BONUS_STATUS = {
    PENDING: "pending",
    PAID: "paid",
};
exports.LOAN_REQUEST_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
};
