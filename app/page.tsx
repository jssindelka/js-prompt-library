"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import type { Prompt } from "@/types/prompt";
import type { Template } from "@/types/template";
import PromptCard from "@/components/PromptCard";
import TemplateCard from "@/components/TemplateCard";
import SearchBar from "@/components/SearchBar";
import PromptModal from "@/components/PromptModal";
import TemplateModal from "@/components/TemplateModal";

type Tab = "library" | "templates";

export default function Home() {
  const [tab, setTab] = useState<Tab>("library");

  // ── Library state ──────────────────────────────────────────
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Prompt | null>(null);
  const [creating, setCreating] = useState(false);
  const [cols, setCols] = useState<2 | 4>(2);

  // ── Templates state ────────────────────────────────────────
  const [templates, setTemplates] = useState<Template[]>([]);
  const [templateSearch, setTemplateSearch] = useState("");
  const [templateFilters, setTemplateFilters] = useState<string[]>([]);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  const FILTER_TAGS = ["Gen AI", "LLM"] as const;
  const FILTER_STYLES: Record<string, { active: string; inactive: string }> = {
    "Gen AI": { active: "bg-yellow-400/20 text-yellow-300 border-yellow-400/40", inactive: "border-border text-muted hover:text-yellow-300 hover:border-yellow-400/30" },
    "LLM":    { active: "bg-cyan-400/20 text-cyan-300 border-cyan-400/40",       inactive: "border-border text-muted hover:text-cyan-300 hover:border-cyan-400/30" },
  };

  const toggleFilter = (tag: string) => {
    setTemplateFilters((prev) =>
      prev.includes(tag) ? [] : [tag]
    );
  };

  const gridClass: Record<number, string> = {
    2: "grid-cols-1 sm:grid-cols-2",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  // ── Library loaders ────────────────────────────────────────
  const loadPrompts = useCallback(async () => {
    const res = await fetch("/api/prompts");
    const data = await res.json();
    setPrompts(data);
  }, []);

  const loadTemplates = useCallback(async () => {
    const res = await fetch("/api/templates");
    const data = await res.json();
    setTemplates(data);
  }, []);

  useEffect(() => { loadPrompts(); }, [loadPrompts]);
  useEffect(() => { loadTemplates(); }, [loadTemplates]);

  // ── Library filtered ───────────────────────────────────────
  const filtered = useMemo(() => {
    if (!search.trim()) return prompts;
    const q = search.toLowerCase();
    return prompts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.prompt.toLowerCase().includes(q)
    );
  }, [prompts, search]);

  // ── Templates filtered ─────────────────────────────────────
  const filteredTemplates = useMemo(() => {
    let list = templates;
    if (templateFilters.length > 0) {
      list = list.filter((t) =>
        templateFilters.every((f) => t.categories?.includes(f))
      );
    }
    if (!templateSearch.trim()) return list;
    const q = templateSearch.toLowerCase();
    return list.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.prompt.toLowerCase().includes(q) ||
        t.categories?.some((c) => c.toLowerCase().includes(q))
    );
  }, [templates, templateSearch, templateFilters]);

  // ── Library handlers ───────────────────────────────────────
  const handleSave = async (data: Partial<Prompt>) => {
    if (data.id) {
      await fetch("/api/prompts", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/prompts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setEditing(null);
    setCreating(false);
    await loadPrompts();
  };

  const handleDeleteFromModal = async () => {
    if (!editing) return;
    await fetch("/api/prompts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id }) });
    setEditing(null);
    await loadPrompts();
  };

  const handleDeleteFromCard = async (id: string) => {
    await fetch("/api/prompts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await loadPrompts();
  };

  // ── Template handlers ──────────────────────────────────────
  const handleTemplateSave = async (data: Partial<Template>) => {
    if (data.id) {
      await fetch("/api/templates", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else {
      await fetch("/api/templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setEditingTemplate(null);
    setCreatingTemplate(false);
    await loadTemplates();
  };

  const handleTemplateDeleteFromModal = async () => {
    if (!editingTemplate) return;
    await fetch("/api/templates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingTemplate.id }) });
    setEditingTemplate(null);
    await loadTemplates();
  };

  const handleTemplateDeleteFromCard = async (id: string) => {
    await fetch("/api/templates", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    await loadTemplates();
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Prompt Library</h1>
          <p className="mt-1 text-sm text-muted">
            {tab === "library"
              ? `${filtered.length} prompt${filtered.length !== 1 ? "s" : ""}`
              : `${filteredTemplates.length} template${filteredTemplates.length !== 1 ? "s" : ""}${templateFilters.length > 0 ? ` · filtered by ${templateFilters.join(", ")}` : ""}`}
          </p>
        </div>
        <button
          onClick={() => tab === "library" ? setCreating(true) : setCreatingTemplate(true)}
          className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-accent/80 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          {tab === "library" ? "New Prompt" : "New Template"}
        </button>
      </header>

      {/* Tabs */}
      <div className="mb-6 flex items-center gap-1 rounded-xl border border-border bg-card p-1 w-fit">
        <button
          onClick={() => setTab("library")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "library" ? "bg-accent text-zinc-950" : "text-muted hover:text-foreground"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Library
        </button>
        <button
          onClick={() => setTab("templates")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            tab === "templates" ? "bg-accent text-zinc-950" : "text-muted hover:text-foreground"
          }`}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Templates
        </button>
      </div>

      {/* ── LIBRARY TAB ─────────────────────────────────────── */}
      {tab === "library" && (
        <>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar value={search} onChange={setSearch} />
            <div className="flex items-center rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setCols(2)}
                title="2 columns"
                className={`px-2.5 py-2 transition-colors ${cols === 2 ? "bg-accent text-zinc-950" : "bg-card text-muted hover:text-foreground"}`}
              >
                {/* 2-column grid */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="6" height="6" rx="1"/>
                  <rect x="9" y="1" width="6" height="6" rx="1"/>
                  <rect x="1" y="9" width="6" height="6" rx="1"/>
                  <rect x="9" y="9" width="6" height="6" rx="1"/>
                </svg>
              </button>
              <button
                onClick={() => setCols(4)}
                title="4 columns"
                className={`px-2.5 py-2 transition-colors ${cols === 4 ? "bg-accent text-zinc-950" : "bg-card text-muted hover:text-foreground"}`}
              >
                {/* 4-column grid */}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="1" y="1" width="3" height="3" rx="0.5"/>
                  <rect x="5" y="1" width="3" height="3" rx="0.5"/>
                  <rect x="9" y="1" width="3" height="3" rx="0.5"/>
                  <rect x="13" y="1" width="3" height="3" rx="0.5"/>
                  <rect x="1" y="5" width="3" height="3" rx="0.5"/>
                  <rect x="5" y="5" width="3" height="3" rx="0.5"/>
                  <rect x="9" y="5" width="3" height="3" rx="0.5"/>
                  <rect x="13" y="5" width="3" height="3" rx="0.5"/>
                  <rect x="1" y="9" width="3" height="3" rx="0.5"/>
                  <rect x="5" y="9" width="3" height="3" rx="0.5"/>
                  <rect x="9" y="9" width="3" height="3" rx="0.5"/>
                  <rect x="13" y="9" width="3" height="3" rx="0.5"/>
                  <rect x="1" y="13" width="3" height="3" rx="0.5"/>
                  <rect x="5" y="13" width="3" height="3" rx="0.5"/>
                  <rect x="9" y="13" width="3" height="3" rx="0.5"/>
                  <rect x="13" y="13" width="3" height="3" rx="0.5"/>
                </svg>
              </button>
            </div>
          </div>

          {filtered.length > 0 && (
            <div className={`grid gap-4 ${gridClass[cols]}`}>
              {filtered.map((p, i) => (
                <PromptCard key={p.id} prompt={p} onEdit={setEditing} onDelete={handleDeleteFromCard} priority={i === 0} />
              ))}
            </div>
          )}

          {filtered.length === 0 && prompts.length > 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="mb-4 h-12 w-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-muted">No prompts found</p>
              <button onClick={() => setSearch("")} className="mt-3 text-sm text-accent hover:underline">Clear search</button>
            </div>
          )}

          {prompts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="mb-4 h-12 w-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-muted">No prompts yet</p>
              <button onClick={() => setCreating(true)} className="mt-3 text-sm text-accent hover:underline">Add your first prompt</button>
            </div>
          )}
        </>
      )}

      {/* ── TEMPLATES TAB ───────────────────────────────────── */}
      {tab === "templates" && (
        <>
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <SearchBar value={templateSearch} onChange={setTemplateSearch} />
            <div className="flex items-center gap-2 shrink-0">
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleFilter(tag)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                    templateFilters.includes(tag)
                      ? FILTER_STYLES[tag].active
                      : FILTER_STYLES[tag].inactive
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {filteredTemplates.length > 0 && (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {filteredTemplates.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  onEdit={setEditingTemplate}
                  onDelete={handleTemplateDeleteFromCard}
                />
              ))}
            </div>
          )}

          {filteredTemplates.length === 0 && templates.length > 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="mb-4 h-12 w-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-muted">No templates found</p>
              <button onClick={() => setTemplateSearch("")} className="mt-3 text-sm text-accent hover:underline">Clear search</button>
            </div>
          )}

          {templates.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="mb-4 h-12 w-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-muted">No templates yet</p>
              <button onClick={() => setCreatingTemplate(true)} className="mt-3 text-sm text-accent hover:underline">Paste your first template</button>
            </div>
          )}
        </>
      )}

      {/* ── Modals ───────────────────────────────────────────── */}
      {(editing || creating) && (
        <PromptModal
          prompt={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={handleSave}
          onDelete={editing ? handleDeleteFromModal : undefined}
        />
      )}

      {(editingTemplate || creatingTemplate) && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => { setEditingTemplate(null); setCreatingTemplate(false); }}
          onSave={handleTemplateSave}
          onDelete={editingTemplate ? handleTemplateDeleteFromModal : undefined}
        />
      )}
    </div>
  );
}
