"use client";

import Link from "next/link";
import { Header } from "../layout/Header";

interface SessionErrorProps {
  error: string;
  showCreateNew?: boolean;
}

export function SessionError({
  error,
  showCreateNew = true,
}: SessionErrorProps) {
  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-bg-page p-4 pt-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl" aria-hidden="true">
            😕
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-text-primary">
              No podemos mostrar esta sesión
            </h1>
            <p className="text-text-secondary" role="alert">
              {error}
            </p>
          </div>

          {showCreateNew && (
            <div className="pt-4">
              <Link
                href="/"
                className="inline-block px-8 py-3 bg-brand-yellow text-brand-black-static font-bold hover:opacity-90 transition-opacity"
              >
                Crear nueva sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
