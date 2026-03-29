"use client";

import { useState } from "react";
import Image from "next/image";
import type { Prompt } from "@/types/prompt";
import ImageLightbox from "@/components/ImageLightbox";

const CATEGORY_STYLES: Record<string, string> = {
  "Gen AI":    "bg-yellow-400/15 text-yellow-300",
  "Character": "bg-accent/10 text-accent/80",
  "LLM":       "bg-cyan-400/15 text-cyan-300",
};
function getCategoryStyle(cat: string) {
  return CATEGORY_STYLES[cat] ?? "bg-zinc-700/40 text-zinc-300";
}

export default function PromptCard({
  prompt,
  onEdit,
  onDelete,
  priority = false,
}: {
  prompt: Prompt;
  onEdit: (p: Prompt) => void;
  onDelete: (id: string) => void;
  priority?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(prompt);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prompt.id);
  };

  return (
    <div
      className="group relative flex flex-col rounded-xl border border-border bg-card overflow-hidden transition-all duration-200 hover:border-accent/40 hover:bg-card-hover"
      onClick={() => {
        if (window.getSelection()?.toString()) return;
        setExpanded(!expanded);
      }}
    >
      {/* Image */}
      {prompt.image && (
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Image
            src={prompt.image}
            alt={prompt.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(true); }}
            className="absolute top-2 right-2 rounded-lg bg-black/50 p-1.5 text-white/70 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            title="View fullscreen"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
            </svg>
          </button>
        </div>
      )}

      {lightbox && prompt.image && (
        <ImageLightbox
          src={prompt.image}
          alt={prompt.title}
          onClose={() => setLightbox(false)}
        />
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        {/* Categories */}
        {prompt.categories && prompt.categories.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-1">
            {prompt.categories.map((cat) => (
              <span key={cat} className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-medium ${getCategoryStyle(cat)}`}>
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* Title + actions */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold leading-tight">{prompt.title}</h3>
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={handleDelete}
              className="flex items-center rounded-lg px-2 py-1.5 text-xs font-medium bg-border text-muted hover:bg-red-500/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
              title="Delete"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center rounded-lg px-2 py-1.5 text-xs font-medium bg-border text-muted hover:bg-accent-dim/30 hover:text-accent transition-all opacity-0 group-hover:opacity-100"
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
                  ? "bg-green-500/20 text-green-400 animate-copied"
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

        {/* Prompt text */}
        <p className={`text-xs leading-relaxed text-muted ${expanded ? "" : "line-clamp-3"}`}>
          {prompt.prompt}
        </p>

        {/* Date */}
        {prompt.createdAt && (
          <p className="text-[10px] text-muted/50 mt-1">
            {new Date(prompt.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        )}
      </div>
    </div>
  );
}
