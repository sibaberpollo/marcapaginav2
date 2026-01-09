"use client";

import type { SessionState } from "@/lib/types";

interface SessionModerationProps {
  sessionState: SessionState;
}

export function SessionModeration({ sessionState }: SessionModerationProps) {
  const { session } = sessionState;

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
      <div className="max-w-lg w-full text-center space-y-6">
        <div className="text-8xl">📋</div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-base-content">
            En revisión editorial
          </h1>
          <p className="text-lg text-base-content/70">
            Tu historia está siendo evaluada por nuestro equipo editorial.
          </p>
        </div>

        {session.theme && (
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <p className="text-sm text-base-content/60">Tema</p>
              <p className="text-xl italic">&ldquo;{session.theme}&rdquo;</p>
            </div>
          </div>
        )}

        <div className="card bg-base-100 shadow-sm">
          <div className="card-body">
            <p className="text-base-content/70">
              Te notificaremos cuando la revisión esté completa. Normalmente
              tardamos entre 24-48 horas.
            </p>
          </div>
        </div>

        <div className="pt-4">
          <a href="/cadavre" className="btn btn-outline rounded-xl">
            Volver al inicio
          </a>
        </div>
      </div>
    </div>
  );
}
