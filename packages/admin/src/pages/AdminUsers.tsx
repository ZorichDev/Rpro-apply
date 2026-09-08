import { useEffect, useState } from "react";
import { fetchAllUsers, suspendUserRequest, unsuspendUserRequest, removeUserRequest } from "../api/admin";

interface UserRow {
  _id: string;
  email: string;
  role: string;
  isSuspended: boolean;
  suspendedReason?: string;
  isDeleted: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [suspendingId, setSuspendingId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  function load() {
    fetchAllUsers()
      .then(({ data }) => setUsers(data.users))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleSuspend(id: string) {
    setBusyId(id);
    try {
      await suspendUserRequest(id, reason || undefined);
      setSuspendingId(null);
      setReason("");
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function handleUnsuspend(id: string) {
    setBusyId(id);
    try {
      await unsuspendUserRequest(id);
      load();
    } finally {
      setBusyId(null);
    }
  }

  async function handleRemove(id: string, email: string) {
    if (!confirm(`Remove ${email}? Their account will be deactivated — this can't be undone from here.`)) {
      return;
    }
    setBusyId(id);
    try {
      await removeUserRequest(id);
      load();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="text-muted text-sm">Loading…</p>;
  if (users.length === 0) return <p className="text-muted text-sm">No users registered yet.</p>;

  return (
    <div className="max-w-3xl grid gap-3">
      {users.map((u) => (
        <div key={u._id} className="card !p-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="font-bold">{u.email}</p>
              <p className="text-sm text-muted">{u.role.replace("_", " ")}</p>
              {u.isSuspended && u.suspendedReason && (
                <p className="text-xs text-brand mt-1">Reason: {u.suspendedReason}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {u.isSuspended ? (
                <span className="badge badge-brand">Suspended</span>
              ) : (
                <span className="badge badge-success">Active</span>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            {u.isSuspended ? (
              <button onClick={() => handleUnsuspend(u._id)} disabled={busyId === u._id} className="btn-secondary !text-xs">
                {busyId === u._id ? "Working…" : "Unsuspend"}
              </button>
            ) : (
              <button onClick={() => setSuspendingId(suspendingId === u._id ? null : u._id)} className="btn-secondary !text-xs">
                Suspend
              </button>
            )}
            <button
              onClick={() => handleRemove(u._id, u.email)}
              disabled={busyId === u._id}
              className="text-xs text-brand font-semibold"
            >
              Remove
            </button>
          </div>

          {suspendingId === u._id && (
            <div className="mt-3 flex gap-2">
              <input
                placeholder="Reason (optional)"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="field-input !py-1.5 !text-xs flex-1"
              />
              <button onClick={() => handleSuspend(u._id)} disabled={busyId === u._id} className="btn-primary !text-xs !px-3">
                Confirm
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
