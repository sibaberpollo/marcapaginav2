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
              ¡Historia completada!
            </h1>
            {session.theme && (
              <p className="text-xl text-text-secondary italic">
                &ldquo;{session.theme}&rdquo;
              </p>
            )}
          </header>

          <article className="bg-bg-primary border border-surface-2 p-6 md:p-8">
            <h2 className="text-xl font-bold text-text-primary text-center mb-8">
              La historia completa
            </h2>

            <div className="space-y-6">
              {segments.map((segment, index) => (
                <div key={segment.id} className="relative">
                  {index > 0 && (
                    <div
                      className="flex items-center gap-2 my-6"
                      aria-hidden="true"
                    >
                      <div className="flex-1 h-px bg-surface-2" />
                      <span className="text-text-secondary/40 text-sm">↓</span>
                      <div className="flex-1 h-px bg-surface-2" />
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
          </article>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-bg-primary border border-surface-2 p-4 text-center">
              <div className="text-3xl font-bold text-text-primary">
                {segments.length}
              </div>
              <div className="text-sm text-text-secondary">Segmentos</div>
            </div>
            <div className="bg-bg-primary border border-surface-2 p-4 text-center">
              <div className="text-3xl font-bold text-text-primary">
                {totalWords}
              </div>
              <div className="text-sm text-text-secondary">Palabras</div>
            </div>
            <div className="bg-bg-primary border border-surface-2 p-4 text-center">
              <div className="text-3xl font-bold text-text-primary">
                {uniqueWriters}
              </div>
              <div className="text-sm text-text-secondary">Escritores</div>
            </div>
          </div>

          {shareLinks.contributor && (
            <section className="pt-8 border-t border-surface-2">
              <ShareLinks
                contributorLink={shareLinks.contributor}
                observerLink={shareLinks.observer}
                sessionTitle={session.theme || undefined}
              />
            </section>
          )}

          <div className="text-center">
            <Link
              href="/"
              className="inline-block px-8 py-4 bg-brand-yellow text-brand-black-static font-bold text-lg hover:opacity-90 transition-opacity"
            >
              Crear otra historia
            </Link>
          </div>
        </main>
      </div>
    </>
  );
}
