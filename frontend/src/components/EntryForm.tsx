"use client";

import { useState } from "react";
import { Category, Project, Entry } from "@/lib/api";

interface Props {
  categories: Category[];
  projects: Project[];
  entry?: Entry | null;
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
}

export function EntryForm({ categories, projects, entry, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState({
    date: entry?.date || new Date().toISOString().split("T")[0],
    description: entry?.description || "",
    amount: entry?.amount?.toString() || "",
    entry_type: entry?.entry_type || "Ausgabe",
    category_id: entry?.category_id?.toString() || "",
    project_ids: entry?.projects?.map((p) => p.id) || [],
    notes: entry?.notes || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      date: form.date,
      description: form.description,
      amount: parseFloat(form.amount),
      entry_type: form.entry_type,
      category_id: form.category_id ? parseInt(form.category_id) : null,
      project_ids: form.project_ids,
      notes: form.notes || null,
    });
  };

  const inputClass = "w-full bg-bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-border-focus outline-none transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-text-muted text-xs mb-1">Datum</label>
          <input type="date" className={inputClass} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        </div>
        <div>
          <label className="block text-text-muted text-xs mb-1">Typ</label>
          <select className={inputClass} value={form.entry_type} onChange={(e) => setForm({ ...form, entry_type: e.target.value })}>
            <option value="Einnahme">Einnahme</option>
            <option value="Ausgabe">Ausgabe</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-text-muted text-xs mb-1">Beschreibung</label>
        <input type="text" className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-text-muted text-xs mb-1">Betrag (€)</label>
          <input type="number" step="0.01" min="0" className={inputClass} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
        </div>
        <div>
          <label className="block text-text-muted text-xs mb-1">Kategorie</label>
          <select className={inputClass} value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Keine</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-text-muted text-xs mb-1">Projekte</label>
        <div className="flex flex-wrap gap-2">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setForm({ ...form, project_ids: form.project_ids.includes(p.id) ? form.project_ids.filter((id) => id !== p.id) : [...form.project_ids, p.id] })}
              className={`px-3 py-1 rounded-full text-xs border transition-all ${
                form.project_ids.includes(p.id)
                  ? "bg-primary/20 border-primary text-primary"
                  : "bg-bg-input border-border text-text-muted hover:border-border-focus"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-text-muted text-xs mb-1">Notizen</label>
        <textarea className={inputClass} rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg bg-bg-input border border-border hover:border-border-focus text-sm transition-all">
          Abbrechen
        </button>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-sm transition-all glow-border">
          {entry ? "Speichern" : "Erstellen"}
        </button>
      </div>
    </form>
  );
}
