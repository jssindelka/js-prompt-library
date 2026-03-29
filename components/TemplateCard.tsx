"use client";

import { useState } from "react";
import type { Template } from "@/types/template";

type View = "template" | "example";

const CATEGORY_STYLES: Record<string, string> = {
  "Gen AI":    "bg-yellow-400/15 text-yellow-300",
  "Character": "bg-accent/10 text-accent/80",
  "LLM":       "bg-cyan-400/15 text-cyan-300",
};

function getCategoryStyle(cat: string): string {
  return CATEGORY_STYLES[cat] ?? "bg-zinc-700/40 text-zinc-300";
}

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
}: {
  template: Template;
  onEdit: (t: Template) => void;
  onDelete: (id: string) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [view, setView] = useState<View>("template");

  const activeText = view === "template" ? template.prompt : template.example;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(template);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(template.id);
  };

  const handleViewSwitch = (e: React.MouseEvent, v: View) => {
    e.stopPropagation();
    setView(v);
  };

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card transition-all duration-200 hover:border-accent/40 hover:bg-card-hover overflow-hidden">

      {/* Header */}
      <div className="flex items-start justify-between gap-2 px-5 pt-5 pb-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <h3 className="text-sm font-semibold leading-tight truncate">{template.title}</h3>
          {template.categories && template.categories.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {template.categories.map((cat) => (
                <span key={cat} className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${getCategoryStyle(cat)}`}>
                  {cat}
                </span>
              ))}
            </div>
          )}
        </div>
        {/* Actions — visible on hover */}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDelete}
            className="flex items-center rounded-lg px-2 py-1.5 text-xs font-medium bg-border text-muted hover:bg-red-500/20 hover:text-red-400 transition-all"
            title="Delete"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
          <button
            onClick={handleEdit}
            className="flex items-center rounded-lg px-2 py-1.5 text-xs font-medium bg-border text-muted hover:bg-accent-dim/30 hover:text-accent transition-all"
            title="Edit"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all ${
              copied
                ? "bg-green-500/20 text-green-400"
                : "bg-border text-muted hover:bg-accent-dim/30 hover:text-accent"
            }`}
          >
            {copied ? (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Copied
              </>
            ) : (
              <>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex items-center gap-0.5 px-5 pb-3">
        <button
          onClick={(e) => handleViewSwitch(e, "template")}
          className={`px-2.5 py-1 text-[11px] font-semibold transition-all border-b-2 ${
            view === "template"
              ? "border-accent text-foreground"
              : "border-transparent text-muted hover:text-foreground"
          }`}
        >
          Template
        </button>
        {template.example && (
          <button
            onClick={(e) => handleViewSwitch(e, "example")}
            className={`px-2.5 py-1 text-[11px] font-semibold transition-all border-b-2 ${
              view === "example"
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            }`}
          >
            Example
          </button>
        )}
      </div>

      {/* Content area */}
      <div
        className="cursor-text px-5 pb-4"
        onClick={() => {
          if (window.getSelection()?.toString()) return;
          setExpanded(!expanded);
        }}
      >
        <p className={`text-xs leading-relaxed font-mono whitespace-pre-wrap ${
          view === "template" ? "text-muted" : "text-foreground/80"
        } ${expanded ? "" : "line-clamp-5"}`}>
          {activeText || <span className="text-muted/40 italic not-italic font-sans">No {view} added yet</span>}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between px-5 pb-4">
        {template.createdAt && (
          <p className="text-[10px] text-muted/50">
            {new Date(template.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}
        {!expanded && activeText && activeText.length > 200 && (
          <span className="text-[10px] text-muted/40 cursor-pointer" onClick={() => setExpanded(true)}>click to expand</span>
        )}
      </div>
    </div>
  );
}
