interface StatusBadgeProps {
  status: string;
}

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  submitted: { label: "Submitted", className: "badge-info" },
  under_review: { label: "Under Review", className: "badge-amber" },
  offer_made: { label: "Offer Made", className: "badge-success" },
  accepted: { label: "Accepted", className: "badge-success" },
  rejected: { label: "Not Offered", className: "badge-brand" },
  withdrawn: { label: "Withdrawn", className: "badge-muted" },
};

// Pill-style status indicator, matching the brand's badge language
// (e.g. "✓ Application Approved", "⏳ Under Review" in the reference design).
export default function StatusBadge({ status }: StatusBadgeProps) {
  const style = STATUS_STYLES[status] ?? STATUS_STYLES.submitted;
  return <span className={`badge ${style.className}`}>{style.label}</span>;
}
