import { CURRENCY_SYMBOLS } from "shared";
export function formatCurrency(amount, currency) {
    // Defensive against stale/incomplete data (e.g. a record saved before
    // this field existed) — shows a clear placeholder instead of crashing
    // the whole page, which is what happened when this had no guard.
    if (typeof amount !== "number" || !currency) {
        return "—";
    }
    const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
    return `${symbol}${amount.toLocaleString()}`;
}
