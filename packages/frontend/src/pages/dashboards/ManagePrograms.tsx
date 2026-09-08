import { useEffect, useState } from "react";
import { CURRENCIES } from "shared";
import { fetchMyPrograms, createProgramRequest, updateProgramRequest, setProgramActiveRequest } from "../../api/programs";
import { formatCurrency } from "../../utils/currency";

interface Program {
  _id: string;
  title: string;
  level: string;
  country: string;
  tuitionAmount: number;
  currency: string;
  isActive: boolean;
}

const emptyForm = { title: "", level: "undergraduate", country: "", tuitionAmount: "", currency: "NGN" };

export default function ManagePrograms() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  function load() {
    fetchMyPrograms()
      .then(({ data }) => setPrograms(data.programs))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function startEdit(p: Program) {
    setEditingId(p._id);
    setShowForm(true);
    setForm({ title: p.title, level: p.level, country: p.country, tuitionAmount: String(p.tuitionAmount), currency: p.currency });
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const payload = {
      title: form.title,
      level: form.level,
      country: form.country,
      tuitionAmount: Number(form.tuitionAmount),
      currency: form.currency,
    };
    try {
      if (editingId) {
        await updateProgramRequest(editingId, payload);
      } else {
        await createProgramRequest(payload);
      }
      cancelForm();
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not save program.");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(p: Program) {
    setBusyId(p._id);
    try {
      await setProgramActiveRequest(p._id, !p.isActive);
      load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <button
        onClick={() => (showForm ? cancelForm() : setShowForm(true))}
        className="btn-primary"
      >
        {showForm ? "Cancel" : "Add program"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="card space-y-3 max-w-md">
          <input required placeholder="Program title" className="field-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <select className="field-input" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
            <option value="diploma">Diploma</option>
            <option value="certificate">Certificate</option>
          </select>
          <input required placeholder="Country" className="field-input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <div className="flex gap-2">
            <input required type="number" min="0" placeholder="Annual tuition" className="field-input flex-1" value={form.tuitionAmount} onChange={(e) => setForm({ ...form, tuitionAmount: e.target.value })} />
            <select className="field-input !w-28" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : editingId ? "Save changes" : "Create program"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : programs.length === 0 ? (
        <p className="text-muted text-sm">Add your first program above — students won't see this dashboard, only what you publish here.</p>
      ) : (
        <div className="grid gap-3">
          {programs.map((p) => (
            <div key={p._id} className="card !p-5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="font-bold">{p.title}</p>
                  <p className="text-sm text-muted">
                    {p.country} · {p.level} · {formatCurrency(p.tuitionAmount, p.currency)}/yr
                  </p>
                </div>
                <span className={`badge ${p.isActive ? "badge-success" : "badge-muted"}`}>
                  {p.isActive ? "Live" : "Deactivated"}
                </span>
              </div>
              <div className="flex gap-3 mt-4">
                <button onClick={() => startEdit(p)} className="btn-secondary !text-xs">
                  Edit
                </button>
                <button
                  onClick={() => handleToggleActive(p)}
                  disabled={busyId === p._id}
                  className="text-xs font-semibold text-brand disabled:opacity-50"
                >
                  {busyId === p._id ? "Working…" : p.isActive ? "Deactivate" : "Reactivate"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
