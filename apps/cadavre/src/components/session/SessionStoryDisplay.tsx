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
      className="card bg-base-100 shadow-sm"
      aria-label={label || "Segmento de la historia"}
    >
      <div className="card-body p-6">
        {label && (
          <p className="text-xs uppercase tracking-wider text-base-content/60 mb-1">
            {label}
          </p>
        )}
        <div className="chat chat-start">
          <div className="chat-bubble chat-bubble-neutral">
            <p className="italic leading-relaxed">
              &ldquo;{segment.content}&rdquo;
            </p>
          </div>
        </div>
        {!segment.isAnonymous && (
          <p className="text-sm text-base-content/60 text-right mt-2">
            — {segment.authorName}
          </p>
        )}
      </div>
    </article>
  );
}
