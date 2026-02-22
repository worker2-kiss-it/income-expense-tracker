"use client";

import { Summary } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell,
  LineChart, Line,
} from "recharts";

const COLORS = [
  "oklch(0.6 0.2 270)",
  "oklch(0.65 0.18 290)",
  "oklch(0.6 0.15 210)",
  "oklch(0.65 0.2 330)",
  "oklch(0.6 0.18 180)",
  "oklch(0.65 0.15 60)",
  "oklch(0.6 0.2 120)",
  "oklch(0.65 0.18 30)",
  "oklch(0.6 0.15 240)",
  "oklch(0.65 0.2 0)",
];

const tooltipStyle = {
  contentStyle: { background: "oklch(0.17 0.025 270)", border: "1px solid oklch(0.3 0.04 270)", borderRadius: "0.5rem", color: "oklch(0.92 0.01 270)" },
  itemStyle: { color: "oklch(0.92 0.01 270)" },
};

export function Dashboard({ summary }: { summary: Summary }) {
  const monthlyWithBalance = summary.monthly.map((m) => ({
    ...m,
    balance: m.income - m.expense,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Bar Chart - Monthly Income vs Expense */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Monatliche Einnahmen vs. Ausgaben</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={summary.monthly}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 270)" />
            <XAxis dataKey="month" stroke="oklch(0.65 0.03 270)" fontSize={12} />
            <YAxis stroke="oklch(0.65 0.03 270)" fontSize={12} tickFormatter={(v) => `€${v}`} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
            <Legend />
            <Bar dataKey="income" name="Einnahmen" fill="oklch(0.7 0.18 155)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" name="Ausgaben" fill="oklch(0.65 0.2 25)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart - Expense by Category */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Ausgaben nach Kategorie</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={summary.by_category}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={{ stroke: "oklch(0.5 0.03 270)" }}
              fontSize={11}
            >
              {summary.by_category.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart - Trends */}
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Monatstrend (Bilanz)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyWithBalance}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 270)" />
            <XAxis dataKey="month" stroke="oklch(0.65 0.03 270)" fontSize={12} />
            <YAxis stroke="oklch(0.65 0.03 270)" fontSize={12} tickFormatter={(v) => `€${v}`} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
            <Legend />
            <Line type="monotone" dataKey="income" name="Einnahmen" stroke="oklch(0.7 0.18 155)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="expense" name="Ausgaben" stroke="oklch(0.65 0.2 25)" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="balance" name="Bilanz" stroke="oklch(0.55 0.2 270)" strokeWidth={2.5} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
