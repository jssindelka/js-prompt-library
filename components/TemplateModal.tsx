"use client";

import { useState, useEffect, useRef } from "react";
import type { Template } from "@/types/template";

const CATEGORY_STYLES: Record<string, string> = {
  "Gen AI":    "bg-yellow-400/15 text-yellow-300",
  "Character": "bg-accent/10 text-accent/80",
  "LLM":       "bg-cyan-400/15 text-cyan-300",
};
function getCategoryStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? "bg-zinc-700/40 text-zinc-300";
}

interface TemplateModalProps {
  template: Template | null;
  onClose: () => void;
  onSave: (data: Partial<Template>) => void;
  onDelete?: () => void;
}

export default function TemplateModal({ template, onClose, onSave, onDelete }: TemplateModalProps) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [example, setExample] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [catInput, setCatInput] = useState("");
  const catInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (template) {
      setTitle(template.title);
      setText(template.prompt);
      setExample(template.example || "");
      setCategories(template.categories ?? []);
    } else {
      setTitle("");
      setText("");
      setExample("");
      setCategories([]);
    }
    setCatInput("");
  }, [template]);

  const addCategory = (raw: string) => {
    const val = raw.trim();
    if (val && !categories.includes(val)) {
      setCategories((prev) => [...prev, val]);
    }
    setCatInput("");
  };

  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  const handleCatKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addCategory(catInput);
    } else if (e.key === "Backspace" && catInput === "" && categories.length > 0) {
      setCategories((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // commit any uncommitted input
    const finalCats = catInput.trim()
      ? [...categories, catInput.trim()].filter((v, i, a) => a.indexOf(v) === i)
      : categories;
    onSave({
      ...(template ? { id: template.id } : {}),
      title: title || "Untitled",
      prompt: text,
      example,
      categories: finalCats,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {template ? "Edit Template" : "New Template"}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-foreground transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
              placeholder="e.g. Product Shot, Hero Portrait..."
            />
          </div>

          {/* Categories tag input */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Categories <span className="text-muted/50 font-normal">(optional · Enter or comma to add)</span>
            </label>
            <div
              className="flex flex-wrap gap-1.5 rounded-lg border border-border bg-background px-3 py-2 cursor-text focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/30"
              onClick={() => catInputRef.current?.focus()}
            >
              {categories.map((cat) => (
                <span
                  key={cat}
                  className={`flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ${getCategoryStyle(cat)}`}
                >
                  {cat}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeCategory(cat); }}
                    className="text-accent/60 hover:text-accent transition-colors"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              <input
                ref={catInputRef}
                type="text"
                value={catInput}
                onChange={(e) => setCatInput(e.target.value)}
                onKeyDown={handleCatKeyDown}
                onBlur={() => addCategory(catInput)}
                className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted/40"
                placeholder={categories.length === 0 ? "e.g. Portrait, Product…" : ""}
              />
            </div>
          </div>

          {/* Template structure */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Template
              <span className="ml-2 text-muted/50 font-normal">— empty structure with placeholders</span>
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              rows={8}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 resize-y font-mono"
              placeholder="Paste your prompt template here..."
            />
          </div>

          {/* Example */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">
              Example
              <span className="ml-2 text-muted/50 font-normal">— filled-in real prompt</span>
            </label>
            <textarea
              value={example}
              onChange={(e) => setExample(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 resize-y font-mono"
              placeholder="Paste a real filled example here..."
            />
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-between">
            <div>
              {template && onDelete && (
                <button
                  type="button"
                  onClick={onDelete}
                  className="rounded-lg px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-muted hover:bg-card-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-accent px-4 py-2 text-xs font-medium text-zinc-950 hover:bg-accent/80 transition-colors"
              >
                {template ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
