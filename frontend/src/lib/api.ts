export interface Entry {
  id: number;
  date: string;
  description: string;
  amount: number;
  entry_type: "Einnahme" | "Ausgabe";
  category_id: number | null;
  category: { id: number; name: string } | null;
  projects: { id: number; name: string }[];
  notes: string | null;
}

export interface Category {
  id: number;
  name: string;
}

export interface Project {
  id: number;
  name: string;
}

export interface Summary {
  total_income: number;
  total_expense: number;
  balance: number;
  monthly: { month: string; income: number; expense: number }[];
  by_category: { name: string; value: number }[];
}

const API = "/api";

export async function fetchEntries(params?: Record<string, string>): Promise<Entry[]> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const r = await fetch(`${API}/entries${qs}`);
  return r.json();
}

export async function createEntry(data: Omit<Entry, "id" | "category" | "projects"> & { project_ids: number[] }): Promise<Entry> {
  const r = await fetch(`${API}/entries`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return r.json();
}

export async function updateEntry(id: number, data: Record<string, unknown>): Promise<Entry> {
  const r = await fetch(`${API}/entries/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  return r.json();
}

export async function deleteEntry(id: number): Promise<void> {
  await fetch(`${API}/entries/${id}`, { method: "DELETE" });
}

export async function fetchCategories(): Promise<Category[]> {
  const r = await fetch(`${API}/categories`);
  return r.json();
}

export async function fetchProjects(): Promise<Project[]> {
  const r = await fetch(`${API}/projects`);
  return r.json();
}

export async function createProject(name: string): Promise<Project> {
  const r = await fetch(`${API}/projects`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
  return r.json();
}

export async function fetchSummary(params?: Record<string, string>): Promise<Summary> {
  const qs = params ? "?" + new URLSearchParams(params).toString() : "";
  const r = await fetch(`${API}/entries/summary${qs}`);
  return r.json();
}
