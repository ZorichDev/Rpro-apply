import { useEffect, useState } from "react";
import { CURRENCIES } from "shared";
import { fetchMyServices, createServiceRequest } from "../../api/services";
import { formatCurrency } from "../../utils/currency";

interface Service {
  _id: string;
  title: string;
  category: string;
  priceAmount: number;
  currency: string;
  isActive: boolean;
}

const CATEGORIES = ["test_prep", "loans", "visa", "housing", "insurance", "other"];

export default function ManageServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", category: "test_prep", description: "", priceAmount: "", currency: "NGN" });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function load() {
    fetchMyServices()
      .then(({ data }) => setServices(data.services))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await createServiceRequest({
        title: form.title,
        category: form.category,
        description: form.description || undefined,
        priceAmount: Number(form.priceAmount),
        currency: form.currency,
      });
      setShowForm(false);
      setForm({ title: "", category: "test_prep", description: "", priceAmount: "", currency: "NGN" });
      load();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Could not create service.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <button onClick={() => setShowForm((v) => !v)} className="btn-primary">
        {showForm ? "Cancel" : "Add service"}
      </button>

      {showForm && (
        <form onSubmit={handleCreate} className="card space-y-3 max-w-md">
          <input
            required
            placeholder="Service title"
            className="field-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <select className="field-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c.replace("_", " ")}</option>
            ))}
          </select>
          <textarea
            placeholder="Description (optional)"
            rows={3}
            className="field-input"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              required
              type="number"
              min="0"
              placeholder="Price"
              className="field-input flex-1"
              value={form.priceAmount}
              onChange={(e) => setForm({ ...form, priceAmount: e.target.value })}
            />
            <select className="field-input !w-28" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          {error && <p className="text-sm text-brand">{error}</p>}
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Saving…" : "Create service"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-muted text-sm">Loading…</p>
      ) : services.length === 0 ? (
        <p className="text-muted text-sm">
          Add your first service above — students will see it once your profile is complete.
        </p>
      ) : (
        <div className="grid gap-3">
          {services.map((s) => (
            <div key={s._id} className="card !p-5">
              <p className="font-bold">{s.title}</p>
              <p className="text-sm text-muted">
                {s.category.replace("_", " ")} · {formatCurrency(s.priceAmount, s.currency)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
