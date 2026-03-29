"use client";

import Image from "next/image";
import { getDisplayUrl } from "@/lib/cloudinary";

export default function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const displayUrl = getDisplayUrl(src);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 cursor-zoom-out"
      onClick={onClose}
    >
      {/* Top-right controls */}
      <div
        className="absolute top-4 right-4 flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Download original */}
        <a
          href={src}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-black/70 transition-colors"
          title="Download original"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>

        {/* Close */}
        <button
          onClick={onClose}
          className="rounded-full bg-black/50 p-2 text-white/80 hover:text-white transition-colors"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Image — display-optimised (~700 KB), download links to original */}
      <div
        className="relative max-h-[90vh] max-w-[90vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={displayUrl}
          alt={alt}
          width={1920}
          height={1080}
          className="max-h-[90vh] w-auto object-contain rounded-lg"
          sizes="90vw"
        />
      </div>
    </div>
  );
}
