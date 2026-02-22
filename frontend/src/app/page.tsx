"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Entry, Category, Project, Summary,
  fetchEntries, fetchCategories, fetchProjects, fetchSummary,
  createEntry, updateEntry, deleteEntry,
} from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Dashboard } from "@/components/Dashboard";
import { EntryForm } from "@/components/EntryForm";
import { EntryTable } from "@/components/EntryTable";
import { BarChart3, Plus, X } from "lucide-react";

export default function Home() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [view, setView] = useState<"table" | "dashboard">("dashboard");
  const [filters, setFilters] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const [e, c, p, s] = await Promise.all([
      fetchEntries(filters),
      fetchCategories(),
      fetchProjects(),
      fetchSummary(filters),
    ]);
    setEntries(e);
    setCategories(c);
    setProjects(p);
    setSummary(s);
  }, [filters]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (data: Parameters<typeof createEntry>[0]) => {
    await createEntry(data);
    setShowForm(false);
    load();
  };

  const handleUpdate = async (id: number, data: Record<string, unknown>) => {
    await updateEntry(id, data);
    setEditingEntry(null);
    load();
  };

  const handleDelete = async (id: number) => {
    // Optimistic removal
    setEntries((prev) => prev.filter((e) => e.id !== id));
    await deleteEntry(id);
    load();
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            💰 Einnahmen & Ausgaben
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setView(view === "dashboard" ? "table" : "dashboard")}
              className="px-4 py-2 rounded-lg bg-bg-card border border-border hover:border-border-focus transition-all text-sm flex items-center gap-2"
            >
              <BarChart3 size={16} />
              {view === "dashboard" ? "Tabelle" : "Dashboard"}
            </button>
            <button
              onClick={() => { setEditingEntry(null); setShowForm(true); }}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-all text-sm flex items-center gap-2 glow-border"
            >
              <Plus size={16} /> Neu
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="glass-card p-6">
              <p className="text-text-muted text-sm mb-1">Einnahmen</p>
              <p className="text-2xl font-bold text-income">{formatCurrency(summary.total_income)}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-text-muted text-sm mb-1">Ausgaben</p>
              <p className="text-2xl font-bold text-expense">{formatCurrency(summary.total_expense)}</p>
            </div>
            <div className="glass-card p-6">
              <p className="text-text-muted text-sm mb-1">Bilanz</p>
              <p className={`text-2xl font-bold ${summary.balance >= 0 ? "text-income" : "text-expense"}`}>
                {formatCurrency(summary.balance)}
              </p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="glass-card p-4 mb-6 flex flex-wrap gap-3 items-center">
          <select
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-border-focus outline-none"
            value={filters.category_id || ""}
            onChange={(e) => setFilters((f) => e.target.value ? { ...f, category_id: e.target.value } : (({ category_id, ...r }) => r)(f))}
          >
            <option value="">Alle Kategorien</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-border-focus outline-none"
            value={filters.project_id || ""}
            onChange={(e) => setFilters((f) => e.target.value ? { ...f, project_id: e.target.value } : (({ project_id, ...r }) => r)(f))}
          >
            <option value="">Alle Projekte</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-border-focus outline-none"
            value={filters.entry_type || ""}
            onChange={(e) => setFilters((f) => e.target.value ? { ...f, entry_type: e.target.value } : (({ entry_type, ...r }) => r)(f))}
          >
            <option value="">Alle Typen</option>
            <option value="Einnahme">Einnahme</option>
            <option value="Ausgabe">Ausgabe</option>
          </select>
          <input
            type="date"
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-border-focus outline-none"
            value={filters.date_from || ""}
            onChange={(e) => setFilters((f) => e.target.value ? { ...f, date_from: e.target.value } : (({ date_from, ...r }) => r)(f))}
          />
          <input
            type="date"
            className="bg-bg-input border border-border rounded-lg px-3 py-2 text-sm focus:border-border-focus outline-none"
            value={filters.date_to || ""}
            onChange={(e) => setFilters((f) => e.target.value ? { ...f, date_to: e.target.value } : (({ date_to, ...r }) => r)(f))}
          />
          {Object.keys(filters).length > 0 && (
            <button onClick={() => setFilters({})} className="text-text-muted hover:text-text text-sm flex items-center gap-1">
              <X size={14} /> Zurücksetzen
            </button>
          )}
        </div>

        {/* Content */}
        {view === "dashboard" && summary ? (
          <Dashboard summary={summary} />
        ) : (
          <EntryTable
            entries={entries}
            onEdit={(e) => { setEditingEntry(e); setShowForm(true); }}
            onDelete={handleDelete}
          />
        )}
      </main>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card glow-border p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingEntry ? "Eintrag bearbeiten" : "Neuer Eintrag"}</h2>
              <button onClick={() => { setShowForm(false); setEditingEntry(null); }} className="text-text-muted hover:text-text">
                <X size={20} />
              </button>
            </div>
            <EntryForm
              categories={categories}
              projects={projects}
              entry={editingEntry}
              onSubmit={editingEntry
                ? (data) => handleUpdate(editingEntry.id, data)
                : handleCreate
              }
              onCancel={() => { setShowForm(false); setEditingEntry(null); }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
