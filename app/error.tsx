"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-muted mb-4">Something went wrong.</p>
        {error.message && (
          <p className="text-xs text-muted/60 mb-6 font-mono">{error.message}</p>
        )}
        <button
          onClick={reset}
          className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-accent/80 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
