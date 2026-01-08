"use client";

"use client";

import { useState, useCallback, useId } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components";

const THEMES = [
  { value: "", label: "Sin tema" },
  {
    value: "Un misterio en la biblioteca",
    label: "Un misterio en la biblioteca",
  },
  { value: "El viaje de un objeto", label: "El viaje de un objeto" },
  { value: "Una noche en el teatro", label: "Una noche en el teatro" },
  { value: "El tiempo se detiene", label: "El tiempo se detiene" },
] as const;

const MAX_CONTRIBUTORS_OPTIONS = [7, 8, 9, 10] as const;
const WORD_COUNT_RANGE = { min: 50, max: 100 };

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

type WordCountStatus = "neutral" | "warning" | "error" | "success";

function getWordCountStatus(count: number): WordCountStatus {
  if (count === 0) return "neutral";
  if (count < WORD_COUNT_RANGE.min) return "warning";
  if (count > WORD_COUNT_RANGE.max) return "error";
  return "success";
}

interface FormState {
  theme: string;
  openingSegment: string;
  maxContributors: number;
}

interface FormErrors {
  openingSegment?: string;
  submit?: string;
}

export default function CadavreLanding() {
  const router = useRouter();
  const formId = useId();

  const [formState, setFormState] = useState<FormState>({
    theme: "",
    openingSegment: "",
    maxContributors: 7,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const wordCount = countWords(formState.openingSegment);
  const wordCountStatus = getWordCountStatus(wordCount);
  const isWordCountValid =
    wordCount >= WORD_COUNT_RANGE.min && wordCount <= WORD_COUNT_RANGE.max;
  const isFormValid =
    isWordCountValid && formState.openingSegment.trim().length > 0;

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormState((prev) => ({ ...prev, theme: e.target.value }));
  };

  const handleOpeningSegmentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    setFormState((prev) => ({ ...prev, openingSegment: value }));

    if (errors.openingSegment) {
      const count = countWords(value);
      if (count >= WORD_COUNT_RANGE.min && count <= WORD_COUNT_RANGE.max) {
        setErrors((prev) => ({ ...prev, openingSegment: undefined }));
      }
    }
  };

  const handleMaxContributorsChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFormState((prev) => ({
      ...prev,
      maxContributors: parseInt(e.target.value, 10),
    }));
  };

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!isFormValid) {
        setErrors({
          openingSegment: `El segmento debe tener entre ${WORD_COUNT_RANGE.min} y ${WORD_COUNT_RANGE.max} palabras`,
        });
        return;
      }

      setIsSubmitting(true);
      setErrors({});

      try {
        const response = await fetch("/api/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            theme: formState.theme || undefined,
            openingSegment: formState.openingSegment,
            maxContributors: formState.maxContributors,
          }),
        });

        const data: unknown = await response.json();

        if (!response.ok) {
          if (
            typeof data === "object" &&
            data !== null &&
            "error" in data &&
            typeof (data as { error: unknown }).error === "string"
          ) {
            throw new Error((data as { error: string }).error);
          }
          throw new Error("Error al crear la sesión");
        }

        if (
          typeof data === "object" &&
          data !== null &&
          "contributorLink" in data &&
          typeof (data as { contributorLink: unknown }).contributorLink ===
            "string"
        ) {
          const contributorLink = (data as { contributorLink: string })
            .contributorLink;
          const url = new URL(contributorLink);
          router.push(url.pathname);
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      } catch (error) {
        setErrors({
          submit:
            error instanceof Error
              ? error.message
              : "Error al crear la sesión. Intenta de nuevo.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [isFormValid, formState, router],
  );

  const scrollToForm = () => {
    document
      .getElementById("crear-sesion")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const statusColors: Record<WordCountStatus, string> = {
    neutral: "text-text-secondary",
    warning: "text-amber-500",
    error: "text-red-500",
    success: "text-emerald-500",
  };

  const progressColors: Record<WordCountStatus, string> = {
    neutral: "bg-surface-2",
    warning: "bg-amber-500",
    error: "bg-red-500",
    success: "bg-emerald-500",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-page pt-16">
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
            aria-hidden="true"
          />

          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-yellow/5 rounded-full blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest uppercase bg-brand-yellow/10 text-brand-yellow rounded-full mb-8">
              Escritura Colaborativa
            </span>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-text-primary tracking-tight leading-none mb-6">
              Cadavre
            </h1>

            <p className="text-xl sm:text-2xl text-text-secondary font-light mb-4">
              Micronarrativas Colaborativas
            </p>

            <p className="text-base sm:text-lg text-text-secondary max-w-xl mx-auto mb-12 leading-relaxed">
              Un juego literario donde las historias nacen sin que nadie vea el
              contexto previo. Inspirado en el{" "}
              <span className="text-brand-yellow font-medium">
                cadáver exquisito surrealista
              </span>
              .
            </p>

            <button
              onClick={scrollToForm}
              className="inline-flex items-center gap-3 bg-brand-yellow text-brand-black-static px-8 py-4 font-bold text-lg hover:scale-105 active:scale-100 transition-transform shadow-lg shadow-brand-yellow/20"
              aria-label="Ir al formulario para crear tu historia"
              suppressHydrationWarning
            >
              Crear tu historia
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                suppressHydrationWarning
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>
          </div>

          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50"
            aria-hidden="true"
          >
            <div className="w-6 h-10 border-2 border-text-secondary/30 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-text-secondary/50 rounded-full" />
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-surface border-y border-surface-2">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-16">
              ¿Cómo funciona?
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  num: 1,
                  title: "Crear",
                  desc: "Escribe el primer fragmento de tu historia (50-100 palabras) y elige un tema opcional.",
                },
                {
                  num: 2,
                  title: "Compartir",
                  desc: "Comparte el enlace con amigos. Cada uno verá solo las últimas palabras del fragmento anterior.",
                },
                {
                  num: 3,
                  title: "Descubrir",
                  desc: "Cuando completen todos, descubran juntos la historia surrealista que crearon.",
                },
              ].map((step) => (
                <div key={step.num} className="relative group">
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-brand-yellow text-brand-black-static font-black text-lg flex items-center justify-center">
                    {step.num}
                  </div>
                  <div className="bg-bg-primary p-8 pt-10 border border-surface-2 h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-brand-yellow/5">
                    <h3 className="text-xl font-bold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="crear-sesion" className="py-24 px-4 scroll-mt-20">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Comienza tu historia
              </h2>
              <p className="text-text-secondary text-lg">
                Escribe el primer fragmento y comparte el enlace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor={`${formId}-theme`}
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Tema{" "}
                  <span className="text-text-secondary font-normal">
                    (opcional)
                  </span>
                </label>
                <select
                  id={`${formId}-theme`}
                  value={formState.theme}
                  onChange={handleThemeChange}
                  className="w-full px-4 py-3 bg-bg-primary border border-surface-2 text-text-primary focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none transition-colors"
                >
                  {THEMES.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Un tema puede guiar a los escritores.
                </p>
              </div>

              <div>
                <label
                  htmlFor={`${formId}-opening`}
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Primer fragmento <span className="text-red-500">*</span>
                </label>
                <textarea
                  id={`${formId}-opening`}
                  value={formState.openingSegment}
                  onChange={handleOpeningSegmentChange}
                  placeholder="Era una vez..."
                  rows={6}
                  className={`w-full px-4 py-3 bg-bg-primary border text-text-primary placeholder:text-text-secondary/40 focus:ring-1 outline-none transition-colors resize-none text-base leading-relaxed ${
                    errors.openingSegment
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : wordCountStatus === "success"
                        ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500"
                        : "border-surface-2 focus:border-brand-yellow focus:ring-brand-yellow"
                  }`}
                  aria-describedby={`${formId}-word-count`}
                  aria-invalid={!!errors.openingSegment}
                />

                <div
                  id={`${formId}-word-count`}
                  className="flex justify-between items-center mt-2"
                >
                  <span
                    className={`text-sm font-mono ${statusColors[wordCountStatus]}`}
                    role="status"
                    aria-live="polite"
                  >
                    {wordCount} {wordCount === 1 ? "palabra" : "palabras"}
                    {wordCountStatus === "success" && " ✓"}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {WORD_COUNT_RANGE.min}-{WORD_COUNT_RANGE.max} requeridas
                  </span>
                </div>

                <div className="w-full h-1 bg-surface-2 mt-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${progressColors[wordCountStatus]}`}
                    style={{
                      width: `${Math.min(100, (wordCount / WORD_COUNT_RANGE.max) * 100)}%`,
                    }}
                    role="progressbar"
                    aria-valuenow={wordCount}
                    aria-valuemin={0}
                    aria-valuemax={WORD_COUNT_RANGE.max}
                  />
                </div>

                {errors.openingSegment && (
                  <p
                    className="mt-2 text-sm text-red-500"
                    role="alert"
                    aria-live="assertive"
                  >
                    {errors.openingSegment}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor={`${formId}-contributors`}
                  className="block text-sm font-medium text-text-primary mb-2"
                >
                  Participantes
                </label>
                <select
                  id={`${formId}-contributors`}
                  value={formState.maxContributors}
                  onChange={handleMaxContributorsChange}
                  className="w-full px-4 py-3 bg-bg-primary border border-surface-2 text-text-primary focus:border-brand-yellow focus:ring-1 focus:ring-brand-yellow outline-none transition-colors"
                >
                  {MAX_CONTRIBUTORS_OPTIONS.map((num) => (
                    <option key={num} value={num}>
                      {num} participantes
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-sm text-text-secondary">
                  Incluye al creador. Más participantes = historia más larga.
                </p>
              </div>

              {errors.submit && (
                <div
                  className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  {errors.submit}
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full py-4 bg-brand-yellow text-brand-black-static font-bold text-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="w-5 h-5 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      suppressHydrationWarning
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
                    Creando sesión...
                  </>
                ) : (
                  "Crear sesión"
                )}
              </button>
            </form>
          </div>
        </section>

        <section className="py-24 px-4 bg-surface border-t border-surface-2">
          <div className="max-w-3xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-brand-yellow/10 text-brand-yellow px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
                suppressHydrationWarning
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Próximamente
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Historias recientes
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Aquí aparecerán las historias completadas por la comunidad.
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-12 opacity-40">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-bg-primary p-6 border border-dashed border-surface-2"
                  aria-hidden="true"
                >
                  <div className="h-4 bg-surface-2 w-3/4 mb-4" />
                  <div className="h-3 bg-surface-2 w-full mb-2" />
                  <div className="h-3 bg-surface-2 w-5/6 mb-2" />
                  <div className="h-3 bg-surface-2 w-4/6" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="py-8 px-4 border-t border-surface-2">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
            <p>
              Un proyecto de{" "}
              <a
                href="https://marcapagina.page"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-yellow hover:underline"
              >
                Marcapágina
              </a>
            </p>
            <p className="font-mono text-xs opacity-60">
              Inspirado en el <em>cadavre exquis</em> surrealista
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
