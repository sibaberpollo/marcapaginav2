"use client";

import Link from "next/link";

import type { SessionState } from "@/lib/types";
import ShareLinks from "@/components/ShareLinks";

interface SessionCompletedProps {
  sessionState: SessionState;
}

export function SessionCompleted({ sessionState }: SessionCompletedProps) {
  const { session, segments } = sessionState;

  // Build share links
  // In production, these would come from the session data
  const contributorLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/cadavre/session/${session.id}/contributor/token`
      : "";
  const observerLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/cadavre/session/${session.id}/observer/token`
      : "";

  return (
    <div className="min-h-screen bg-bg-page">
      <main className="max-w-3xl mx-auto px-4 py-12 space-y-8">
        {/* Header */}
        <header className="text-center space-y-4">
          <div className="text-8xl">🎉</div>
          <h1 className="text-4xl font-bold text-base-content">
            ¡Historia completada!
          </h1>
          {session.theme && (
            <p className="text-2xl text-base-content/70 italic">
              &ldquo;{session.theme}&rdquo;
            </p>
          )}
        </header>

        {/* Story reveal */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body space-y-6">
            <h2 className="card-title justify-center text-2xl">
              La historia completa
            </h2>

            <div className="space-y-6">
              {segments.map((segment, index) => (
                <div key={segment.id} className="relative">
                  {index > 0 && (
                    <div className="flex items-center gap-2 my-4">
                      <div className="flex-1 h-px bg-base-300" />
                      <span className="text-base-content/40 text-sm">↓</span>
                      <div className="flex-1 h-px bg-base-300" />
                    </div>
                  )}
                  <p className="text-lg leading-relaxed">{segment.content}</p>
                  {!segment.isAnonymous && (
                    <p className="text-sm text-base-content/60 mt-2 text-right">
                      — {segment.authorName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card bg-base-100 text-center">
            <div className="card-body py-4">
              <div className="text-3xl font-bold">{segments.length}</div>
              <div className="text-sm text-base-content/60">Segmentos</div>
            </div>
          </div>
          <div className="card bg-base-100 text-center">
            <div className="card-body py-4">
              <div className="text-3xl font-bold">
                {segments.reduce(
                  (acc, s) => acc + s.content.split(" ").length,
                  0,
                )}
              </div>
              <div className="text-sm text-base-content/60">Palabras</div>
            </div>
          </div>
          <div className="card bg-base-100 text-center">
            <div className="card-body py-4">
              <div className="text-3xl font-bold">
                {new Set(segments.map((s) => s.authorId)).size}
              </div>
              <div className="text-sm text-base-content/60">Escritores</div>
            </div>
          </div>
        </div>

        {/* Share */}
        <section className="pt-8 border-t border-base-200">
          <ShareLinks
            contributorLink={contributorLink}
            observerLink={observerLink}
            sessionTitle={session.theme || undefined}
          />
        </section>

        {/* Create new */}
        <div className="text-center">
          <Link href="/cadavre" className="btn btn-primary btn-lg rounded-xl">
            Crear otra historia
          </Link>
        </div>
      </main>
    </div>
  );
}
