"use client";

import { useState, useEffect } from "react";

import type { SessionState } from "@/lib/types";

interface SessionActiveObserverProps {
  sessionState: SessionState;
}

export function SessionActiveObserver({
  sessionState,
}: SessionActiveObserverProps) {
  const { session, segments, contributors, currentContributorId } =
    sessionState;
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const refreshSessionState = () => {
      setLastUpdate(new Date());
      // Fetch updated state from API
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set("t", Date.now().toString());
      window.location.search = searchParams.toString();
    };

    const interval = setInterval(refreshSessionState, 10000);
    return () => clearInterval(interval);
  }, []);

  // Get current contributor info - need to get name from segments
  const currentContributor = contributors.find(
    (c) => c.id === currentContributorId,
  );

  // Find the segment by current contributor to get author info
  const currentSegment = segments.find(
    (s) => s.authorId === currentContributor?.userId,
  );

  // Get the last segment (what observers see)
  const lastSegment = segments[segments.length - 1];

  const progress = (segments.length / session.maxContributors) * 100;
  const remainingContributors = session.maxContributors - segments.length;

  return (
    <div className="min-h-screen bg-bg-page">
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <header className="text-center space-y-2">
          <div className="text-6xl">👀</div>
          <h1 className="text-2xl font-bold text-base-content">
            Observando: {session.theme || "Historia colaborativa"}
          </h1>
          <p className="text-sm text-base-content/60">
            Última actualización: {lastUpdate.toLocaleTimeString()}
          </p>
        </header>

        {/* Progress bar */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body py-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-base-content/70">
                Progreso: {segments.length}/{session.maxContributors} segmentos
              </span>
              <span className="font-medium">
                {remainingContributors} restantes
              </span>
            </div>
            <progress
              className="progress progress-info w-full"
              value={progress}
              max="100"
            />
          </div>
        </div>

        {/* Current writer info */}
        {currentContributor && currentSegment && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body py-4">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-info text-info-content rounded-full w-12">
                    <span className="text-lg">✍️</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    {currentSegment.isAnonymous
                      ? "Alguien"
                      : currentSegment.authorName}{" "}
                    está escribiendo...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Last segment display */}
        {lastSegment && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💬</div>
                <div className="flex-1">
                  <p className="text-sm text-base-content/50 mb-2">
                    Último segmento agregado
                  </p>
                  <p className="text-base-content/80 italic leading-relaxed">
                    &ldquo;{lastSegment.content}&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contributors list */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <h3 className="card-title text-lg">
              Colaboradores ({contributors.length})
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {contributors.map((contributor, index) => (
                <div
                  key={contributor.id}
                  className={`badge ${
                    contributor.id === currentContributorId
                      ? "badge-warning"
                      : "badge-ghost"
                  }`}
                >
                  {/* Need to check segments for author name */}
                  {segments.find((s) => s.authorId === contributor.userId)
                    ?.isAnonymous
                    ? `#${index + 1}`
                    : segments.find((s) => s.authorId === contributor.userId)
                        ?.authorName || `#${index + 1}`}
                  {contributor.id === currentContributorId && " ✍️"}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refresh notice */}
        <div className="text-center">
          <p className="text-sm text-base-content/50">
            Esta página se actualiza automáticamente cada 10 segundos
          </p>
        </div>
      </main>
    </div>
  );
}
