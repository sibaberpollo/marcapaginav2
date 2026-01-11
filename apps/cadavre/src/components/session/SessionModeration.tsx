"use client";

import Link from "next/link";

import type { SessionState } from "@/lib/types";
import { Header } from "../layout/Header";

interface SessionModerationProps {
  sessionState: SessionState;
}

export function SessionModeration({ sessionState }: SessionModerationProps) {
  const { session } = sessionState;

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-bg-page p-4 pt-20">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="text-8xl" aria-hidden="true">
            📋
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-text-primary">
              En revisión editorial
            </h1>
            <p className="text-lg text-text-secondary">
              Tu historia está siendo evaluada por nuestro equipo editorial.
            </p>
          </div>

          {session.theme && (
            <div className="card bg-base-100 shadow-sm">
              <div className="card-body">
                <p className="text-sm text-text-secondary">Tema</p>
                <p className="text-xl italic text-text-primary">
                  &ldquo;{session.theme}&rdquo;
                </p>
              </div>
            </div>
          )}

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <p className="text-text-secondary">
                Te notificaremos cuando la revisión esté completa. Normalmente
                tardamos entre 24-48 horas.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <Link
              href="/"
              className="btn btn-outline border-surface-2 text-text-primary hover:bg-surface"
            >
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
