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
        <div className="card bg-base-100 shadow-xl max-w-md w-full">
          <div className="card-body items-center text-center">
            <div className="text-6xl" aria-hidden="true">
              😕
            </div>

            <h1 className="card-title text-2xl text-text-primary">
              No podemos mostrar esta sesión
            </h1>
            <p className="text-text-secondary" role="alert">
              {error}
            </p>

            {showCreateNew && (
              <div className="card-actions mt-4">
                <Link
                  href="/"
                  className="btn bg-brand-yellow text-brand-black-static font-bold border-none hover:opacity-90"
                >
                  Crear nueva sesión
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
