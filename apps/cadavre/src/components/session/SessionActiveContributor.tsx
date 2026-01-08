"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { SessionState } from "@/lib/types";
import { SessionStoryDisplay } from "./SessionStoryDisplay";

interface SessionActiveContributorProps {
  sessionState: SessionState;
  isMyTurn: boolean;
  myPosition: number;
}

const WORD_COUNT_RANGE = { min: 50, max: 100 };

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function getWordCountStatus(
  count: number,
): "neutral" | "warning" | "error" | "success" {
  if (count === 0) return "neutral";
  if (count < WORD_COUNT_RANGE.min) return "warning";
  if (count > WORD_COUNT_RANGE.max) return "error";
  return "success";
}

export function SessionActiveContributor({
  sessionState,
  isMyTurn,
  myPosition,
}: SessionActiveContributorProps) {
  const router = useRouter();
  const { session, segments, contributors, currentContributorId, voteStatus } =
    sessionState;

  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPassing, setIsPassing] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(300); // 5 minutes countdown

  const wordCount = countWords(content);
  const wordCountStatus = getWordCountStatus(wordCount);
  const isWordCountValid =
    wordCount >= WORD_COUNT_RANGE.min && wordCount <= WORD_COUNT_RANGE.max;

  // Get current contributor info
  const currentContributor = contributors.find(
    (c) => c.id === currentContributorId,
  );

  // Find the segment by current contributor to get author info
  const currentSegment = segments.find(
    (s) => s.authorId === currentContributor?.userId,
  );

  // Get the last segment (what current writer sees)
  const lastSegment = segments[segments.length - 1];

  // Countdown timer
  useEffect(() => {
    if (!isMyTurn) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isMyTurn]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Refresh session state
  const refreshState = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("t", Date.now().toString());
    router.replace(`?${searchParams.toString()}`);
  }, []);

  // Handle segment submission
  const handleSubmit = useCallback(() => {
    if (!isWordCountValid || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    void (async () => {
      try {
        const response = await fetch(`/api/sessions/${session.id}/submit`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit segment");
        }

        if (data.sessionState.session.status === "completed") {
          // Navigate to completed page
          router.push(`/cadavre/session/${session.id}/contributor/token`);
        } else {
          // Refresh to update state
          refreshState();
          setContent("");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to submit segment",
        );
      } finally {
        setIsSubmitting(false);
      }
    })();
  }, [session.id, content, isWordCountValid, isSubmitting, refreshState]);

  // Handle pass turn
  const handlePass = useCallback(() => {
    if (isPassing) return;

    setIsPassing(true);
    setError(null);

    void (async () => {
      try {
        const response = await fetch(`/api/sessions/${session.id}/pass`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to pass turn");
        }

        refreshState();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to pass turn");
      } finally {
        setIsPassing(false);
      }
    })();
  }, [session.id, isPassing, refreshState]);

  // Handle vote to end
  const handleVoteEnd = useCallback(() => {
    if (isVoting || !voteStatus?.canProposeEnd) return;

    setIsVoting(true);
    setError(null);

    void (async () => {
      try {
        const response = await fetch(`/api/sessions/${session.id}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to submit vote");
        }

        if (data.votePassed) {
          router.push(`/cadavre/session/${session.id}/contributor/token`);
        } else {
          refreshState();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to submit vote");
      } finally {
        setIsVoting(false);
      }
    })();
  }, [session.id, voteStatus, isVoting, router, refreshState]);

  const progress = (segments.length / session.maxContributors) * 100;
  const remainingContributors = session.maxContributors - segments.length;

  return (
    <div className="min-h-screen bg-bg-page">
      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        {/* Header with countdown */}
        <header className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-base-content">
            {isMyTurn ? "¡Es tu turno!" : "Esperando tu turno"}
          </h1>
          {session.theme && (
            <p className="text-lg text-base-content/70 italic">
              {session.theme}
            </p>
          )}
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
              className="progress progress-warning w-full"
              value={progress}
              max="100"
            />
          </div>
        </div>

        {/* Countdown timer */}
        {isMyTurn && (
          <div className="card bg-warning/10 border-2 border-warning">
            <div className="card-body py-4 text-center">
              <span className="text-warning font-medium">Tiempo restante</span>
              <span className="text-4xl font-bold tabular-nums">
                {formatTime(countdown)}
              </span>
            </div>
          </div>
        )}

        {!isMyTurn && currentContributor && currentSegment && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body py-4">
              <div className="flex items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-brand-yellow text-brand-black rounded-full w-12">
                    <span className="text-lg">✍️</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-base-content/70">
                    {currentSegment.isAnonymous
                      ? "Escritor actual"
                      : currentSegment.authorName}{" "}
                    está escribiendo...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Story display (last segment for context) */}
        {lastSegment && (
          <SessionStoryDisplay
            segment={lastSegment}
            label="Último segmento visible"
          />
        )}

        {/* Your position */}
        <div className="card bg-base-100 shadow-sm">
          <div className="card-body py-4">
            <div className="flex justify-between items-center">
              <span className="text-base-content/70">Tu posición</span>
              <span className="font-medium">#{myPosition + 1}</span>
            </div>
          </div>
        </div>

        {/* Contribution editor (your turn) */}
        {isMyTurn && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body space-y-4">
              <h2 className="card-title">Tu contribución</h2>

              <textarea
                className="textarea textarea-bordered w-full h-32"
                placeholder="Escribe aquí tu segmento (50-100 palabras)..."
                maxLength={500}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={isSubmitting}
              />

              <div className="flex justify-between items-center">
                <span
                  className={`text-sm ${
                    wordCountStatus === "success"
                      ? "text-success"
                      : wordCountStatus === "error"
                        ? "text-error"
                        : wordCountStatus === "warning"
                          ? "text-warning"
                          : "text-base-content/60"
                  }`}
                >
                  {wordCount} / {WORD_COUNT_RANGE.min}-{WORD_COUNT_RANGE.max}{" "}
                  palabras
                </span>
                <button
                  className="btn btn-primary rounded-xl"
                  disabled={!isWordCountValid || isSubmitting}
                  onClick={handleSubmit}
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar"
                  )}
                </button>
              </div>

              {error && (
                <div className="alert alert-error">
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Pass option */}
        {isMyTurn && (
          <div className="text-center">
            <button
              className="btn btn-ghost btn-sm text-base-content/60"
              onClick={handlePass}
              disabled={isPassing}
            >
              {isPassing ? "Pasando..." : "Pasar mi turno"}
            </button>
          </div>
        )}

        {/* Vote to end */}
        {voteStatus?.canProposeEnd && !isMyTurn && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body py-4 text-center">
              <p className="text-sm text-base-content/70 mb-2">
                ¿Ya tiene suficiente historia?
              </p>
              <button
                className="btn btn-outline btn-sm rounded-xl"
                onClick={handleVoteEnd}
                disabled={isVoting || voteStatus.hasVoted}
              >
                {isVoting ? (
                  <>
                    <span className="loading loading-spinner loading-sm" />
                    Votando...
                  </>
                ) : voteStatus.hasVoted ? (
                  "Voto registrado"
                ) : (
                  "Proponer terminar"
                )}
              </button>
              {voteStatus.inProgress && (
                <p className="text-xs text-base-content/50 mt-2">
                  {voteStatus.votesForEnd}/{voteStatus.totalVotes} votos
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
