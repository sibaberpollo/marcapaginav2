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
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body">
        {label && <p className="text-sm text-base-content/50 mb-2">{label}</p>}
        <div className="flex items-start gap-3">
          <div className="text-2xl">💬</div>
          <div className="flex-1 space-y-2">
            <p className="text-base-content/80 italic leading-relaxed">
              &ldquo;{segment.content}&rdquo;
            </p>
            {!segment.isAnonymous && (
              <p className="text-sm text-base-content/60">
                — {segment.authorName}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
