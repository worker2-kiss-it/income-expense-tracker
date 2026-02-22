"use client";

import { Entry } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
}

export function EntryTable({ entries, onEdit, onDelete }: Props) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-4 py-3 text-text-muted font-medium">Datum</th>
              <th className="text-left px-4 py-3 text-text-muted font-medium">Beschreibung</th>
              <th className="text-left px-4 py-3 text-text-muted font-medium">Typ</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Betrag</th>
              <th className="text-left px-4 py-3 text-text-muted font-medium">Kategorie</th>
              <th className="text-left px-4 py-3 text-text-muted font-medium">Projekte</th>
              <th className="text-right px-4 py-3 text-text-muted font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-border/30 hover:bg-bg-card-hover transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">{entry.date}</td>
                <td className="px-4 py-3">
                  <div>{entry.description}</div>
                  {entry.notes && <div className="text-text-muted text-xs mt-0.5">{entry.notes}</div>}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    entry.entry_type === "Einnahme"
                      ? "bg-income/15 text-income"
                      : "bg-expense/15 text-expense"
                  }`}>
                    {entry.entry_type}
                  </span>
                </td>
                <td className={`px-4 py-3 text-right font-mono font-medium ${
                  entry.entry_type === "Einnahme" ? "text-income" : "text-expense"
                }`}>
                  {entry.entry_type === "Einnahme" ? "+" : "−"}{formatCurrency(entry.amount)}
                </td>
                <td className="px-4 py-3 text-text-muted">{entry.category?.name || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 flex-wrap">
                    {entry.projects.map((p) => (
                      <span key={p.id} className="px-2 py-0.5 rounded-full text-xs bg-primary/15 text-primary border border-primary/30">
                        {p.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onEdit(entry)} className="p-1.5 rounded-lg hover:bg-bg-card transition-colors text-text-muted hover:text-text">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(entry.id)} className="p-1.5 rounded-lg hover:bg-danger/10 transition-colors text-text-muted hover:text-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-text-muted">Keine Einträge gefunden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
