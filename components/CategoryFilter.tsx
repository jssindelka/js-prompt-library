"use client";

export default function CategoryFilter({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string;
  onChange: (cat: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onChange("All")}
        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
          active === "All"
            ? "bg-accent text-zinc-950"
            : "bg-border text-muted hover:bg-card-hover hover:text-foreground"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
            active === cat
              ? "bg-accent text-zinc-950"
              : "bg-border text-muted hover:bg-card-hover hover:text-foreground"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
