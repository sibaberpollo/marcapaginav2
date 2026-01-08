"use client";

import Link from "next/link";

interface SessionErrorProps {
  error: string;
  showCreateNew?: boolean;
}

export function SessionError({
  error,
  showCreateNew = true,
}: SessionErrorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-6xl">😕</div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-base-content">
            No podemos mostrar esta sesión
          </h1>
          <p className="text-base-content/70">{error}</p>
        </div>

        {showCreateNew && (
          <div className="pt-4">
            <Link
              href="/cadavre"
              className="btn btn-primary btn-wide rounded-xl"
            >
              Crear nueva sesión
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
