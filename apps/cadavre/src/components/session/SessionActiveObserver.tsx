"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { SessionState } from "@/lib/types";
import { Header } from "../layout/Header";

interface SessionActiveObserverProps {
  sessionState: SessionState;
}

export function SessionActiveObserver({
  sessionState,
}: SessionActiveObserverProps) {
  const router = useRouter();
  const { session, segments, contributors, currentContributorId } =
    sessionState;
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshState = useCallback(() => {
    setLastUpdate(new Date());
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("t", Date.now().toString());
    router.replace(`?${searchParams.toString()}`);
  }, [router]);

  // Auto-refresh every 10 seconds
  useEffect(() => {
    const interval = setInterval(refreshState, 10000);
    return () => clearInterval(interval);
  }, [refreshState]);

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
    <>
      <Header />
      <div className="min-h-screen bg-bg-page pt-16">
        <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
          <header className="text-center space-y-2">
            <div className="text-6xl">👀</div>
            <h1 className="text-2xl font-bold text-text-primary">
              Observando: {session.theme || "Historia colaborativa"}
            </h1>
            <p className="text-sm text-text-secondary">
              Última actualización: {lastUpdate.toLocaleTimeString()}
            </p>
          </header>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body py-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-text-secondary">
                  Progreso: {segments.length}/{session.maxContributors}{" "}
                  segmentos
                </span>
                <span className="font-medium text-text-primary">
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

          {currentContributor && currentSegment && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body py-4">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-brand-yellow text-brand-black-static rounded-full w-12">
                      <span className="text-lg">✍️</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">
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

          {lastSegment && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <div className="flex items-start gap-3">
                  <div className="text-2xl">💬</div>
                  <div className="flex-1">
                    <p className="text-sm text-text-secondary mb-2">
                      Último segmento agregado
                    </p>
                    <p className="text-text-primary/80 italic leading-relaxed">
                      &ldquo;{lastSegment.content}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-lg text-text-primary">
                Colaboradores ({contributors.length})
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {contributors.map((contributor, index) => {
                  const segment = segments.find(
                    (s) => s.authorId === contributor.userId,
                  );
                  const displayName = segment?.isAnonymous
                    ? `#${index + 1}`
                    : segment?.authorName || `#${index + 1}`;

                  return (
                    <div
                      key={contributor.id}
                      className={`badge ${
                        contributor.id === currentContributorId
                          ? "badge-warning"
                          : "badge-ghost"
                      }`}
                    >
                      {displayName}
                      {contributor.id === currentContributorId && " ✍️"}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-text-secondary">
              Esta página se actualiza automáticamente cada 10 segundos
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
