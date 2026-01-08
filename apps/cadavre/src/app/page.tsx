"use client";

import { useState, useCallback, useId } from "react";
import { useRouter } from "next/navigation";

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

interface FormState {
  theme: string;
  openingSegment: string;
  maxContributors: number;
}

interface FormErrors {
  openingSegment?: string;
  submit?: string;
}

type WordCountStatus = "neutral" | "warning" | "error" | "success";

interface ThemeSelectorProps {
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

interface OpeningSegmentFieldProps {
  id: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  wordCount: number;
  wordCountStatus: WordCountStatus;
  error?: string;
}

interface MaxContributorsSelectorProps {
  id: string;
  value: number;
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
}

function getWordCountStatusColor(status: WordCountStatus): string {
  const colors: Record<WordCountStatus, string> = {
    success: "text-success",
    error: "text-error",
    warning: "text-warning",
    neutral: "text-text-secondary",
  };
  return colors[status];
}

function getProgressBarColor(status: WordCountStatus): string {
  const colors: Record<WordCountStatus, string> = {
    success: "bg-success",
    error: "bg-error",
    warning: "bg-warning",
    neutral: "bg-surface",
  };
  return colors[status];
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
  const isWordCountValid =
    wordCount >= WORD_COUNT_RANGE.min && wordCount <= WORD_COUNT_RANGE.max;
  const isFormValid =
    isWordCountValid && formState.openingSegment.trim().length > 0;

  const getWordCountStatus = useCallback((): WordCountStatus => {
    if (wordCount === 0) return "neutral";
    if (wordCount < WORD_COUNT_RANGE.min) return "warning";
    if (wordCount > WORD_COUNT_RANGE.max) return "error";
    return "success";
  }, [wordCount]);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
  };

  const scrollToForm = () => {
    document
      .getElementById("crear-sesion")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const wordCountStatus = getWordCountStatus();

  return (
    <main className="min-h-screen bg-bg-page">
      <HeroSection onCtaClick={scrollToForm} />
      <HowItWorksSection />

      <section id="crear-sesion" className="py-24 px-6 scroll-mt-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Comienza tu historia
            </h2>
            <p className="text-text-secondary text-lg">
              Escribe el primer fragmento y comparte el enlace con tus
              colaboradores.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <ThemeSelector
              id={`${formId}-theme`}
              value={formState.theme}
              onChange={handleThemeChange}
            />

            <OpeningSegmentField
              id={`${formId}-opening`}
              value={formState.openingSegment}
              onChange={handleOpeningSegmentChange}
              wordCount={wordCount}
              wordCountStatus={wordCountStatus}
              error={errors.openingSegment}
            />

            <MaxContributorsSelector
              id={`${formId}-contributors`}
              value={formState.maxContributors}
              onChange={handleMaxContributorsChange}
            />

            {errors.submit && <SubmitError message={errors.submit} />}

            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="btn w-full bg-brand-yellow text-brand-black-static border-0 hover:bg-text-primary hover:text-bg-page disabled:bg-surface-2 disabled:text-text-secondary disabled:cursor-not-allowed font-bold text-lg h-14 rounded-none shadow-[4px_4px_0_0_rgba(0,0,0,0.15)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.2)] transition-all duration-300 disabled:shadow-none"
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

      <RecentStoriesPlaceholder />
      <Footer />
    </main>
  );
}

function HeroSection({ onCtaClick }: { onCtaClick: () => void }) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <div
        className="absolute top-20 left-10 w-64 h-64 bg-brand-yellow/10 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-text-primary/5 rounded-full blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <p className="text-brand-yellow font-mono text-sm tracking-[0.3em] uppercase mb-6">
          Escritura Colaborativa
        </p>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary leading-[0.9] tracking-tight mb-8">
          Cadavre
          <span className="block text-3xl md:text-4xl lg:text-5xl font-light text-text-secondary mt-4 tracking-normal">
            Micronarrativas Colaborativas
          </span>
        </h1>

        <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed">
          Un juego literario donde las historias nacen sin que nadie vea el
          contexto previo. Cada participante añade un fragmento a una narrativa
          colectiva e impredecible.
          <span className="text-brand-yellow font-medium">
            {" "}
            Inspirado en el cadáver exquisito surrealista.
          </span>
        </p>

        <button
          onClick={onCtaClick}
          className="group inline-flex items-center gap-3 bg-brand-yellow text-brand-black-static px-8 py-4 rounded-none font-bold text-lg hover:bg-text-primary hover:text-bg-page transition-all duration-300 shadow-[4px_4px_0_0_rgba(0,0,0,0.2)] hover:shadow-[6px_6px_0_0_rgba(0,0,0,0.3)] hover:-translate-y-0.5"
        >
          Crear tu historia
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-y-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        aria-hidden="true"
      >
        <div className="w-6 h-10 border-2 border-text-secondary/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-text-secondary/50 rounded-full" />
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "Crear",
      description:
        "Escribe el primer fragmento de tu historia (50-100 palabras) y elige un tema opcional.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
      ),
    },
    {
      number: 2,
      title: "Compartir",
      description:
        "Comparte el enlace con amigos. Cada uno verá solo las últimas palabras del fragmento anterior.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
        />
      ),
    },
    {
      number: 3,
      title: "Escribir",
      description:
        "Cuando completen todos, descubran juntos la historia surrealista que crearon.",
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      ),
    },
  ];

  return (
    <section className="py-24 px-6 bg-surface border-y border-surface-2">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-text-primary text-center mb-16">
          ¿Cómo funciona?
        </h2>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step) => (
            <div key={step.number} className="relative group">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-brand-yellow text-brand-black-static font-black text-xl flex items-center justify-center shadow-[3px_3px_0_0_rgba(0,0,0,0.15)]">
                {step.number}
              </div>
              <div className="bg-bg-primary p-8 pt-12 border border-surface-2 h-full transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="w-16 h-16 mb-6 flex items-center justify-center bg-surface rounded-full">
                  <svg
                    className="w-8 h-8 text-text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    {step.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ThemeSelector({ id, value, onChange }: ThemeSelectorProps) {
  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium text-text-primary">
          Tema{" "}
          <span className="text-text-secondary font-normal">(opcional)</span>
        </span>
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="select select-bordered w-full bg-bg-primary border-surface-2 text-text-primary focus:border-brand-yellow focus:outline-none transition-colors"
      >
        {THEMES.map((theme) => (
          <option key={theme.value} value={theme.value}>
            {theme.label}
          </option>
        ))}
      </select>
      <label className="label">
        <span className="label-text-alt text-text-secondary">
          Un tema puede guiar a los escritores, pero no es obligatorio.
        </span>
      </label>
    </div>
  );
}

function OpeningSegmentField({
  id,
  value,
  onChange,
  wordCount,
  wordCountStatus,
  error,
}: OpeningSegmentFieldProps) {
  const getBorderClass = () => {
    if (error) return "border-error focus:border-error";
    if (wordCountStatus === "success")
      return "border-success focus:border-success";
    return "focus:border-brand-yellow";
  };

  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium text-text-primary">
          Primer fragmento <span className="text-error">*</span>
        </span>
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder="Era una vez..."
        rows={6}
        className={`textarea textarea-bordered w-full bg-bg-primary border-surface-2 text-text-primary placeholder:text-text-secondary/50 focus:outline-none transition-colors resize-none text-base leading-relaxed ${getBorderClass()}`}
        aria-describedby={`${id}-word-count`}
        aria-invalid={!!error}
      />

      <div id={`${id}-word-count`} className="label justify-between">
        <span
          className={`label-text-alt font-mono transition-colors ${getWordCountStatusColor(wordCountStatus)}`}
        >
          {wordCount} {wordCount === 1 ? "palabra" : "palabras"}
        </span>
        <span className="label-text-alt text-text-secondary">
          {WORD_COUNT_RANGE.min}-{WORD_COUNT_RANGE.max} requeridas
        </span>
      </div>

      <div className="w-full h-1.5 bg-surface-2 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getProgressBarColor(wordCountStatus)}`}
          style={{
            width: `${Math.min(100, (wordCount / WORD_COUNT_RANGE.max) * 100)}%`,
          }}
        />
      </div>

      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
}

function MaxContributorsSelector({
  id,
  value,
  onChange,
}: MaxContributorsSelectorProps) {
  return (
    <div className="form-control w-full">
      <label htmlFor={id} className="label">
        <span className="label-text font-medium text-text-primary">
          Número de participantes{" "}
          <span className="text-text-secondary font-normal">(opcional)</span>
        </span>
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="select select-bordered w-full bg-bg-primary border-surface-2 text-text-primary focus:border-brand-yellow focus:outline-none transition-colors"
      >
        {MAX_CONTRIBUTORS_OPTIONS.map((num) => (
          <option key={num} value={num}>
            {num} participantes
          </option>
        ))}
      </select>
      <label className="label">
        <span className="label-text-alt text-text-secondary">
          Incluye al creador. Más participantes = historia más larga.
        </span>
      </label>
    </div>
  );
}

function SubmitError({ message }: { message: string }) {
  return (
    <div className="alert alert-error shadow-lg">
      <svg
        className="w-6 h-6 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

function RecentStoriesPlaceholder() {
  return (
    <section className="py-24 px-6 bg-surface border-t border-surface-2">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-brand-yellow/10 text-brand-yellow px-4 py-2 rounded-full text-sm font-medium mb-6">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Próximamente
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
          Historias recientes
        </h2>
        <p className="text-text-secondary text-lg max-w-xl mx-auto">
          Aquí aparecerán las historias completadas por la comunidad. Las
          mejores serán publicadas en{" "}
          <span className="text-brand-yellow font-medium">Transtextos</span>.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mt-12 opacity-50">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-bg-primary p-6 border border-surface-2 border-dashed"
            >
              <div className="h-4 bg-surface-2 rounded w-3/4 mb-4" />
              <div className="h-3 bg-surface-2 rounded w-full mb-2" />
              <div className="h-3 bg-surface-2 rounded w-5/6 mb-2" />
              <div className="h-3 bg-surface-2 rounded w-4/6" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-surface-2">
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
        <p className="font-mono text-xs">
          Inspirado en el <em>cadavre exquis</em> surrealista
        </p>
      </div>
    </footer>
  );
}
