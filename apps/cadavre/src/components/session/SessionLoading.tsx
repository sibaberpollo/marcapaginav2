"use client";

interface SessionLoadingProps {
  message?: string;
}

export function SessionLoading({
  message = "Cargando sesión...",
}: SessionLoadingProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-page">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-base-300 rounded-full animate-spin border-t-brand-yellow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">✍️</span>
          </div>
        </div>
        <p className="text-base-content/70">{message}</p>
      </div>
    </div>
  );
}
