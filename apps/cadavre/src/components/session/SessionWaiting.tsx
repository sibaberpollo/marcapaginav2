"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { type LinkType } from "@/lib/links";
import type { SessionState } from "@/lib/types";
import { Header } from "../layout/Header";

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

      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to join queue");
    } finally {
      setIsJoining(false);
    }
  }, [session.id, token, isJoining]);

  const isContributor = linkType === "contributor";
  const queuePosition = myPosition >= 0 ? myPosition : contributors.length;
  const estimatedWait = queuePosition * 5;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-page pt-16">
        <main className="max-w-xl mx-auto px-4 py-12 space-y-8">
          <header className="text-center space-y-4">
            <div className="text-5xl" aria-hidden="true">
              ⏳
            </div>
            <h1 className="text-3xl font-bold text-text-primary">
              Esperando para comenzar
            </h1>
            {session.theme && (
              <p className="text-xl text-text-secondary italic">
                &ldquo;{session.theme}&rdquo;
              </p>
            )}
          </header>

          <div className="card bg-base-100 border border-surface-2">
            <div className="card-body p-6 space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-surface-2">
                <span className="text-text-secondary">Estado</span>
                <span className="badge badge-warning">En espera</span>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-surface-2">
                <span className="text-text-secondary">Colaboradores</span>
                <span className="font-medium text-text-primary">
                  {contributors.length} / {session.maxContributors}
                </span>
              </div>

              {isContributor && (
                <>
                  <div className="flex justify-between items-center py-2 border-b border-surface-2">
                    <span className="text-text-secondary">
                      Tu posición en la cola
                    </span>
                    <span className="font-medium text-text-primary">
                      #{queuePosition}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-text-secondary">
                      Tiempo estimado de espera
                    </span>
                    <span className="font-medium text-text-primary">
                      ~{estimatedWait} minutos
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {isContributor && (
            <div className="space-y-4">
              <button
                onClick={handleJoinQueue}
                disabled={isJoining}
                className="btn btn-block py-4 bg-brand-yellow text-brand-black-static font-bold hover:opacity-90 disabled:opacity-40 border-0"
              >
                {isJoining ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Uniéndote...
                  </>
                ) : (
                  "Unirse a la cola"
                )}
              </button>

              {error && (
                <div className="alert alert-error" role="alert">
                  <span>{error}</span>
                </div>
              )}

              <p className="text-center text-sm text-text-secondary">
                Necesitamos al menos {session.maxContributors} escritores para
                comenzar
              </p>
            </div>
          )}

          {!isContributor && (
            <div className="text-center space-y-4">
              <p className="text-text-secondary">
                Esta historia aún no ha comenzado. Como observador, podrás ver
                el progreso en tiempo real cuando inicie.
              </p>
              <Link
                href={`/session/${session.id}/contributor/${session.id}`}
                className="btn btn-outline border-surface-2 text-text-primary hover:bg-surface hover:border-surface-2"
              >
                ¿Quieres participar como escritor?
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
