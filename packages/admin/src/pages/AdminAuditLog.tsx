import { useEffect, useState } from "react";
import { fetchAuditLog } from "../api/admin";

interface LogEntry {
  _id: string;
  actorEmail: string;
  action: string;
  targetEmail: string;
  reason?: string;
  createdAt: string;
}

const ACTION_LABELS: Record<string, string> = {
  "user.suspend": "suspended",
  "user.unsuspend": "unsuspended",
  "user.remove": "removed",
  "institution.verify": "verified accreditation for",
};

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminAuditLog() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLog()
      .then(({ data }) => setLogs(data.logs))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (logs.length === 0) return <p className="text-muted text-sm">No moderation actions taken yet.</p>;

  return (
    <div className="max-w-3xl grid gap-3">
      {logs.map((log) => (
        <div key={log._id} className="card !p-4">
          <p className="text-sm">
            <span className="font-bold">{log.actorEmail}</span>{" "}
            <span className="text-muted">{ACTION_LABELS[log.action] ?? log.action}</span>{" "}
            <span className="font-bold">{log.targetEmail}</span>
          </p>
          <p className="text-xs text-muted mt-1">
            {formatDateTime(log.createdAt)}
            {log.reason && ` · "${log.reason}"`}
          </p>
        </div>
      ))}
    </div>
  );
}
