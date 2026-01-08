"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { type LinkType } from "@/lib/links";
import type { SessionState } from "@/lib/types";

interface SessionWaitingProps {
  sessionState: SessionState;
  linkType: LinkType;
}

export function SessionWaiting({
  sessionState,
  linkType,
}: SessionWaitingProps) {
  const { session, contributors, myPosition } = sessionState;
  const searchParams = useSearchParams();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get token from URL
  const token = searchParams.get("token") || "";

  const handleJoinQueue = useCallback(async () => {
    if (!token || isJoining) return;

    setIsJoining(true);
    setError(null);

    try {
      const response = await fetch(`/api/sessions/${session.id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkToken: token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to join queue");
      }

      // Refresh to get updated state
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join queue");
    } finally {
      setIsJoining(false);
    }
  }, [session.id, token, isJoining]);

  const isContributor = linkType === "contributor";
  const queuePosition = myPosition >= 0 ? myPosition : contributors.length;
  const estimatedWait = queuePosition * 5; // 5 minutes per contributor

  return (
    <div className="min-h-screen bg-bg-page">
      <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="text-6xl">⏳</div>
          <h1 className="text-3xl font-bold text-base-content">
            Esperando para comenzar
          </h1>
          {session.theme && (
            <p className="text-xl text-base-content/70 italic">
              &ldquo;{session.theme}&rdquo;
            </p>
          )}
        </header>

        {/* Session Info */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-base-content/70">Estado</span>
              <span className="badge badge-warning">En espera</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-base-200">
              <span className="text-base-content/70">Colaboradores</span>
              <span className="font-medium">
                {contributors.length} / {session.maxContributors}
              </span>
            </div>

            {isContributor && (
              <>
                <div className="flex justify-between items-center py-2 border-b border-base-200">
                  <span className="text-base-content/70">
                    Tu posición en la cola
                  </span>
                  <span className="font-medium">#{queuePosition}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-base-content/70">
                    Tiempo estimado de espera
                  </span>
                  <span className="font-medium">~{estimatedWait} minutos</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action */}
        {isContributor && (
          <div className="space-y-4">
            <button
              onClick={handleJoinQueue}
              disabled={isJoining}
              className="btn btn-primary btn-wide w-full rounded-xl"
            >
              {isJoining ? (
                <>
                  <span className="loading loading-spinner" />
                  Uniéndote...
                </>
              ) : (
                "Unirse a la cola"
              )}
            </button>

            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            <p className="text-center text-sm text-base-content/60">
              Necesitamos al menos {session.maxContributors} escritores para
              comenzar
            </p>
          </div>
        )}

        {!isContributor && (
          <div className="text-center space-y-4">
            <p className="text-base-content/70">
              Esta historia aún no ha comenzado. Como observador, podrás ver el
              progreso en tiempo real cuando inicie.
            </p>
            <Link
              href={`/cadavre/session/${session.id}/contributor/${session.id}`}
              className="btn btn-outline btn-wide rounded-xl"
            >
              ¿Quieres participar como escritor?
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
