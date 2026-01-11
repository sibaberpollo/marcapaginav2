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

const CONTRIBUTORS_RANGE = { min: 2, max: 5 };
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
    maxContributors: 2,
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
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      const clamped = Math.min(
        CONTRIBUTORS_RANGE.max,
        Math.max(CONTRIBUTORS_RANGE.min, value),
      );
      setFormState((prev) => ({ ...prev, maxContributors: clamped }));
    }
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
    warning: "text-warning",
    error: "text-error",
    success: "text-success",
  };

  const progressColors: Record<WordCountStatus, string> = {
    neutral: "progress-primary",
    warning: "progress-warning",
    error: "progress-error",
    success: "progress-success",
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
            <span className="badge badge-lg bg-brand-yellow/10 text-brand-yellow border-0 font-semibold tracking-widest uppercase mb-8">
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
              className="btn btn-lg bg-brand-yellow text-brand-black-static border-0 hover:bg-brand-yellow/90 hover:scale-105 active:scale-100 transition-transform shadow-lg shadow-brand-yellow/20 gap-3"
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
                  <div className="badge badge-lg absolute -top-3 -left-3 w-10 h-10 bg-brand-yellow text-brand-black-static border-0 font-black text-lg">
                    {step.num}
                  </div>
                  <div className="card bg-base-100 border border-surface-2 h-full transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-brand-yellow/5">
                    <div className="card-body pt-10">
                      <h3 className="card-title text-xl font-bold text-text-primary">
                        {step.title}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
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
              <div className="form-control w-full">
                <label className="label" htmlFor={`${formId}-theme`}>
                  <span className="label-text text-text-primary font-medium">
                    Tema{" "}
                    <span className="text-text-secondary font-normal">
                      (opcional)
                    </span>
                  </span>
                </label>
                <select
                  id={`${formId}-theme`}
                  value={formState.theme}
                  onChange={handleThemeChange}
                  className="select select-bordered w-full bg-bg-primary border-surface-2 text-text-primary focus:border-brand-yellow focus:outline-brand-yellow"
                >
                  {THEMES.map((theme) => (
                    <option key={theme.value} value={theme.value}>
                      {theme.label}
                    </option>
                  ))}
                </select>
                <label className="label">
                  <span className="label-text-alt text-text-secondary">
                    Un tema puede guiar a los escritores.
                  </span>
                </label>
              </div>

              <div className="form-control w-full">
                <label className="label" htmlFor={`${formId}-opening`}>
                  <span className="label-text text-text-primary font-medium">
                    Primer fragmento <span className="text-error">*</span>
                  </span>
                </label>
                <textarea
                  id={`${formId}-opening`}
                  value={formState.openingSegment}
                  onChange={handleOpeningSegmentChange}
                  placeholder="Era una vez..."
                  rows={6}
                  className={`textarea textarea-bordered w-full bg-bg-primary text-text-primary placeholder:text-text-secondary/40 resize-none text-base leading-relaxed ${
                    errors.openingSegment
                      ? "textarea-error"
                      : wordCountStatus === "success"
                        ? "textarea-success"
                        : "border-surface-2 focus:border-brand-yellow focus:outline-brand-yellow"
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

                <progress
                  className={`progress w-full h-1 mt-2 ${progressColors[wordCountStatus]}`}
                  value={Math.min(
                    100,
                    (wordCount / WORD_COUNT_RANGE.max) * 100,
                  )}
                  max="100"
                  aria-valuenow={wordCount}
                  aria-valuemin={0}
                  aria-valuemax={WORD_COUNT_RANGE.max}
                />

                {errors.openingSegment && (
                  <label className="label">
                    <span
                      className="label-text-alt text-error"
                      role="alert"
                      aria-live="assertive"
                    >
                      {errors.openingSegment}
                    </span>
                  </label>
                )}
              </div>

              <div className="form-control w-full">
                <label className="label" htmlFor={`${formId}-contributors`}>
                  <span className="label-text text-text-primary font-medium">
                    Participantes
                  </span>
                </label>
                <input
                  type="number"
                  id={`${formId}-contributors`}
                  value={formState.maxContributors}
                  onChange={handleMaxContributorsChange}
                  min={CONTRIBUTORS_RANGE.min}
                  max={CONTRIBUTORS_RANGE.max}
                  className="input input-bordered w-full bg-bg-primary border-surface-2 text-text-primary focus:border-brand-yellow focus:outline-brand-yellow"
                />
                <label className="label">
                  <span className="label-text-alt text-text-secondary">
                    Entre {CONTRIBUTORS_RANGE.min} y {CONTRIBUTORS_RANGE.max}.
                    Incluye al creador.
                  </span>
                </label>
              </div>

              {errors.submit && (
                <div
                  className="alert alert-error text-sm"
                  role="alert"
                  aria-live="assertive"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="stroke-current shrink-0 h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{errors.submit}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="btn btn-lg w-full bg-brand-yellow text-brand-black-static border-0 hover:bg-brand-yellow/90 disabled:bg-brand-yellow/40 disabled:text-brand-black-static/60"
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-md" />
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
            <span className="badge badge-lg bg-brand-yellow/10 text-brand-yellow border-0 gap-2 px-4 py-3">
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
                  className="card bg-base-100 border border-dashed border-surface-2"
                  aria-hidden="true"
                >
                  <div className="card-body">
                    <div className="skeleton h-4 w-3/4 mb-4" />
                    <div className="skeleton h-3 w-full mb-2" />
                    <div className="skeleton h-3 w-5/6 mb-2" />
                    <div className="skeleton h-3 w-4/6" />
                  </div>
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
