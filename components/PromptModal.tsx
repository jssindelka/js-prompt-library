"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import type { Prompt } from "@/types/prompt";
import { generateTitle } from "@/lib/generateTitle";

interface PromptModalProps {
  prompt: Prompt | null;
  onClose: () => void;
  onSave: (data: Partial<Prompt>) => void;
  onDelete?: () => void;
}

export default function PromptModal({ prompt, onClose, onSave, onDelete }: PromptModalProps) {
  const [title, setTitle] = useState("");
  const [titleManual, setTitleManual] = useState(false);
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (data.path) setImage(data.path);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const autoTitle = useMemo(() => generateTitle(text), [text]);

  useEffect(() => {
    if (!titleManual && autoTitle) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(autoTitle);
    }
  }, [autoTitle, titleManual]);

  useEffect(() => {
    if (prompt) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(prompt.title);
       
      setTitleManual(true);
       
      setText(prompt.prompt);
       
      setImage(prompt.image || "");
    }
  }, [prompt]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(prompt ? { id: prompt.id } : {}),
      title,
      prompt: text,
      image: image || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {prompt ? "Edit Prompt" : "New Prompt"}
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
            <div className="mb-1 flex items-center justify-between">
              <label className="text-xs font-medium text-muted">Title</label>
              {titleManual && autoTitle && (
                <button
                  type="button"
                  onClick={() => { setTitleManual(false); setTitle(autoTitle); }}
                  className="text-[10px] text-accent hover:underline"
                >
                  Auto-generate
                </button>
              )}
              {!titleManual && title && (
                <span className="text-[10px] text-accent/60">auto</span>
              )}
            </div>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleManual(true); }}
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
              placeholder="Auto-generated from prompt..."
            />
          </div>

          {/* Prompt text */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Prompt</label>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setTitleManual(false); }}
              required
              rows={6}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm leading-relaxed focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 resize-y"
              placeholder="Enter your prompt text..."
            />
          </div>

          {/* Image upload */}
          <div>
            <label className="mb-1 block text-xs font-medium text-muted">Image (optional)</label>
            {image ? (
              <div className="relative rounded-lg border border-border overflow-hidden">
                <div className="relative aspect-video w-full">
                  <Image src={image} alt="Preview" fill className="object-cover" sizes="500px" />
                </div>
                <button
                  type="button"
                  onClick={() => setImage("")}
                  className="absolute top-2 right-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-red-500/80 transition-colors"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-6 transition-colors cursor-pointer ${
                  dragOver
                    ? "border-accent bg-accent/10"
                    : "border-border hover:border-accent/40"
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
                {uploading ? (
                  <p className="text-xs text-muted">Uploading...</p>
                ) : (
                  <>
                    <svg className="mb-2 h-6 w-6 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-muted">Drop image here or click to browse</p>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-2 flex items-center justify-between">
            <div>
              {prompt && onDelete && (
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
                {prompt ? "Save" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
