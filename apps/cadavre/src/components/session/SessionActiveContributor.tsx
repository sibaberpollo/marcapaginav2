"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

import type { SessionState } from "@/lib/types";
import { Header } from "../layout/Header";
import { SessionStoryDisplay } from "./SessionStoryDisplay";

interface SessionActiveContributorProps {
  sessionState: SessionState;
  isMyTurn: boolean;
  myPosition: number;
}

const WORD_COUNT_RANGE = { min: 50, max: 100 };
const COUNTDOWN_SECONDS = 300;

type WordCountStatus = "neutral" | "warning" | "error" | "success";

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

function getWordCountStatus(count: number): WordCountStatus {
  if (count === 0) return "neutral";
  if (count < WORD_COUNT_RANGE.min) return "warning";
  if (count > WORD_COUNT_RANGE.max) return "error";
  return "success";
}

const statusColors: Record<WordCountStatus, string> = {
  neutral: "text-text-secondary",
  warning: "text-amber-500",
  error: "text-red-500",
  success: "text-emerald-500",
};

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
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);

  const wordCount = countWords(content);
  const wordCountStatus = getWordCountStatus(wordCount);
  const isWordCountValid =
    wordCount >= WORD_COUNT_RANGE.min && wordCount <= WORD_COUNT_RANGE.max;

  const currentContributor = contributors.find(
    (c) => c.id === currentContributorId,
  );
  const currentSegment = segments.find(
    (s) => s.authorId === currentContributor?.userId,
  );
  const lastSegment = segments[segments.length - 1];

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

  const refreshState = useCallback(() => {
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set("t", Date.now().toString());
    router.replace(`?${searchParams.toString()}`);
  }, [router]);

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
          router.push(`/session/${session.id}/contributor/token`);
        } else {
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
  }, [
    session.id,
    content,
    isWordCountValid,
    isSubmitting,
    refreshState,
    router,
  ]);

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
          router.push(`/session/${session.id}/contributor/token`);
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

  const remainingContributors = session.maxContributors - segments.length;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-page pt-16">
        <main className="max-w-xl mx-auto px-4 py-8 space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-text-primary">
              {isMyTurn ? "¡Es tu turno!" : "Esperando tu turno"}
            </h1>
            {session.theme && (
              <p className="text-lg text-text-secondary italic">
                {session.theme}
              </p>
            )}
          </header>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
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
                className="progress progress-warning w-full"
                value={segments.length}
                max={session.maxContributors}
                aria-label={`Progreso: ${segments.length} de ${session.maxContributors} segmentos`}
              />
            </div>
          </div>

          {isMyTurn && (
            <div className="alert alert-warning shadow-sm">
              <div className="flex flex-col items-center w-full">
                <span className="font-medium text-sm">Tiempo restante</span>
                <div
                  className="text-4xl font-bold tabular-nums mt-1"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {formatTime(countdown)}
                </div>
              </div>
            </div>
          )}

          {!isMyTurn && currentContributor && currentSegment && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4 flex-row items-center gap-4">
                <div className="avatar placeholder">
                  <div className="bg-brand-yellow text-brand-black-static w-12 h-12">
                    <span className="text-lg" aria-hidden="true">
                      ✍️
                    </span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  {currentSegment.isAnonymous
                    ? "Escritor actual"
                    : currentSegment.authorName}{" "}
                  está escribiendo...
                </p>
              </div>
            </div>
          )}

          {lastSegment && (
            <SessionStoryDisplay
              segment={lastSegment}
              label="Último segmento visible"
            />
          )}

          <div className="stats bg-base-100 shadow-sm w-full">
            <div className="stat py-3 px-4">
              <div className="stat-title text-text-secondary">Tu posición</div>
              <div className="stat-value text-lg text-text-primary">
                #{myPosition + 1}
              </div>
            </div>
          </div>

          {isMyTurn && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-6 space-y-4">
                <h2 className="card-title text-lg font-bold text-text-primary">
                  Tu contribución
                </h2>

                <textarea
                  className="textarea textarea-bordered w-full h-32 bg-bg-page text-text-primary placeholder:text-text-secondary/40 focus:textarea-warning resize-none"
                  placeholder="Escribe aquí tu segmento (50-100 palabras)..."
                  maxLength={500}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isSubmitting}
                  aria-describedby="word-count-status"
                />

                <div className="flex justify-between items-center">
                  <span
                    id="word-count-status"
                    className={`text-sm font-mono ${statusColors[wordCountStatus]}`}
                    role="status"
                    aria-live="polite"
                  >
                    {wordCount} / {WORD_COUNT_RANGE.min}-{WORD_COUNT_RANGE.max}{" "}
                    palabras
                    {wordCountStatus === "success" && " ✓"}
                  </span>
                  <button
                    className="btn bg-brand-yellow text-brand-black-static hover:opacity-90 border-none"
                    disabled={!isWordCountValid || isSubmitting}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="w-4 h-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar"
                    )}
                  </button>
                </div>

                <progress
                  className={`progress w-full ${
                    wordCountStatus === "success"
                      ? "progress-success"
                      : wordCountStatus === "error"
                        ? "progress-error"
                        : wordCountStatus === "warning"
                          ? "progress-warning"
                          : ""
                  }`}
                  value={Math.min(
                    100,
                    (wordCount / WORD_COUNT_RANGE.max) * 100,
                  )}
                  max={100}
                />

                {error && (
                  <div className="alert alert-error" role="alert">
                    <span className="text-sm">{error}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {isMyTurn && (
            <div className="text-center">
              <button
                className="btn btn-ghost btn-sm text-text-secondary hover:text-text-primary"
                onClick={handlePass}
                disabled={isPassing}
              >
                {isPassing ? "Pasando..." : "Pasar mi turno"}
              </button>
            </div>
          )}

          {voteStatus?.canProposeEnd && !isMyTurn && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body p-4 items-center text-center">
                <p className="text-sm text-text-secondary mb-3">
                  ¿Ya tiene suficiente historia?
                </p>
                <button
                  className="btn btn-outline"
                  onClick={handleVoteEnd}
                  disabled={isVoting || voteStatus.hasVoted}
                >
                  {isVoting ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Votando...
                    </>
                  ) : voteStatus.hasVoted ? (
                    "Voto registrado"
                  ) : (
                    "Proponer terminar"
                  )}
                </button>
                {voteStatus.inProgress && (
                  <p className="text-xs text-text-secondary mt-2">
                    {voteStatus.votesForEnd}/{voteStatus.totalVotes} votos
                  </p>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
