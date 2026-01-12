"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import type { SessionState } from "@/lib/types";
import ShareLinks from "@/components/ShareLinks";
import { Header } from "../layout/Header";

interface SessionCompletedProps {
  sessionState: SessionState;
}

export function SessionCompleted({ sessionState }: SessionCompletedProps) {
  const { session, segments } = sessionState;
  const [shareLinks, setShareLinks] = useState({
    contributor: "",
    observer: "",
  });

  useEffect(() => {
    const origin = window.location.origin;
    setShareLinks({
      contributor: `${origin}/session/${session.id}/contributor/token`,
      observer: `${origin}/session/${session.id}/observer/token`,
    });
  }, [session.id]);

  const totalWords = segments.reduce(
    (acc, s) => acc + s.content.split(" ").length,
    0,
  );
  const uniqueWriters = new Set(segments.map((s) => s.authorId)).size;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-bg-page pt-16">
        <main className="max-w-2xl mx-auto px-4 py-12 space-y-8">
          <header className="text-center space-y-4">
            <div className="text-7xl" aria-hidden="true">
              🎉
            </div>
            <h1 className="text-4xl font-bold text-text-primary">
              {session.title || "¡Historia completada!"}
            </h1>
            {session.theme && (
              <p className="text-xl text-text-secondary italic">
                &ldquo;{session.theme}&rdquo;
              </p>
            )}
          </header>

          <article className="card bg-base-100 shadow-md">
            <div className="card-body p-6 md:p-8">
              <h2 className="card-title text-xl font-bold text-text-primary justify-center mb-8">
                La historia completa
              </h2>

              <div className="space-y-6">
                {segments.map((segment, index) => (
                  <div key={segment.id} className="relative">
                    {index > 0 && (
                      <div className="divider my-6" aria-hidden="true">
                        <span className="text-text-secondary/40 text-sm">
                          ↓
                        </span>
                      </div>
                    )}
                    <p className="text-lg leading-relaxed text-text-primary">
                      {segment.content}
                    </p>
                    {!segment.isAnonymous && (
                      <p className="text-sm text-text-secondary mt-2 text-right">
                        — {segment.authorName}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </article>

          <div className="stats stats-horizontal bg-base-100 shadow w-full">
            <div className="stat place-items-center">
              <div className="stat-value text-text-primary">
                {segments.length}
              </div>
              <div className="stat-title text-text-secondary">Segmentos</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-value text-text-primary">{totalWords}</div>
              <div className="stat-title text-text-secondary">Palabras</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-value text-text-primary">
                {uniqueWriters}
              </div>
              <div className="stat-title text-text-secondary">Escritores</div>
            </div>
          </div>

          {shareLinks.contributor && (
            <section>
              <div className="divider" />
              <ShareLinks
                contributorLink={shareLinks.contributor}
                observerLink={shareLinks.observer}
                sessionTitle={session.title || session.theme || undefined}
              />
            </section>
          )}

          <div className="text-center">
            <Link
              href="/"
              className="btn btn-primary btn-lg bg-brand-yellow text-brand-black-static border-none hover:bg-brand-yellow/90"
            >
              Crear otra historia
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
