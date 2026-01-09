"use client";

import type { Segment } from "@/lib/types";

interface SessionStoryDisplayProps {
  segment: Segment;
  label?: string;
}

export function SessionStoryDisplay({
  segment,
  label,
}: SessionStoryDisplayProps) {
  return (
    <article
      className="bg-bg-primary border border-surface-2 p-6"
      aria-label={label || "Segmento de la historia"}
    >
      {label && (
        <p className="text-xs uppercase tracking-wider text-text-secondary mb-3">
          {label}
        </p>
      )}
      <div className="flex items-start gap-3">
        <div className="text-2xl flex-shrink-0" aria-hidden="true">
          💬
        </div>
        <div className="flex-1 space-y-2">
          <p className="text-text-primary italic leading-relaxed">
            &ldquo;{segment.content}&rdquo;
          </p>
          {!segment.isAnonymous && (
            <p className="text-sm text-text-secondary">
              — {segment.authorName}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
