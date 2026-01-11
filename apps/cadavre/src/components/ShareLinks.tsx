"use client";

import { useState, useCallback } from "react";

interface ShareLinksProps {
  contributorLink: string;
  observerLink: string;
  sessionTitle?: string;
}

type LinkType = "contributor" | "observer";
type CopiedState = LinkType | "all" | null;

const SHARE_MESSAGE = "¡Vamos a crear una historia juntos! Únete aquí:";
const COPY_FEEDBACK_DURATION_MS = 2000;

function buildShareText(link: string, sessionTitle?: string): string {
  const titlePart = sessionTitle ? `"${sessionTitle}" - ` : "";
  return `${SHARE_MESSAGE}\n${titlePart}${link}`;
}

function buildAllLinksText(
  contributorLink: string,
  observerLink: string,
  sessionTitle?: string,
): string {
  const titlePart = sessionTitle ? `"${sessionTitle}"\n\n` : "";
  return (
    `${SHARE_MESSAGE}\n\n${titlePart}` +
    `✍️ Enlace para escribir:\n${contributorLink}\n\n` +
    `👁️ Enlace para observar:\n${observerLink}`
  );
}

function CopyIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
      />
    </svg>
  );
}

function CheckIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function TwitterIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function QRCodeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
      />
    </svg>
  );
}

function PenIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );
}

function EyeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  );
}

interface QRCodePlaceholderProps {
  link: string;
  label: string;
}

function QRCodePlaceholder({ label }: QRCodePlaceholderProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-24 h-24 bg-base-200 flex items-center justify-center border-2 border-dashed border-base-300"
        aria-hidden="true"
      >
        <QRCodeIcon className="w-10 h-10 text-base-content/40" />
      </div>
      <span className="text-xs text-base-content/70 text-center">{label}</span>
    </div>
  );
}

interface LinkCardProps {
  type: LinkType;
  link: string;
  sessionTitle?: string;
  copied: CopiedState;
  // eslint-disable-next-line no-unused-vars
  onCopy: (linkType: LinkType) => void;
}

function LinkCard({ type, link, sessionTitle, copied, onCopy }: LinkCardProps) {
  const isContributor = type === "contributor";
  const isCopied = copied === type;

  const config = isContributor
    ? {
        title: "Enlace para escribir",
        subtitle: "Comparte con quienes quieres que escriban",
        icon: PenIcon,
        headerBg: "bg-brand-yellow",
        headerText: "text-brand-black-static",
        cardBorder: "border-brand-yellow/30 hover:border-brand-yellow/60",
        inputBg: "bg-brand-yellow/10",
        buttonClass: "btn-warning",
      }
    : {
        title: "Enlace para observar",
        subtitle: "Solo lectura, sin participación",
        icon: EyeIcon,
        headerBg: "bg-neutral",
        headerText: "text-neutral-content",
        cardBorder: "border-base-300 hover:border-base-content/30",
        inputBg: "bg-base-200",
        buttonClass: "btn-neutral",
      };

  const Icon = config.icon;

  const handleWhatsAppShare = useCallback(() => {
    const text = encodeURIComponent(buildShareText(link, sessionTitle));
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  }, [link, sessionTitle]);

  const handleTwitterShare = useCallback(() => {
    const text = encodeURIComponent(buildShareText(link, sessionTitle));
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [link, sessionTitle]);

  const handleFacebookShare = useCallback(() => {
    const url = encodeURIComponent(link);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank",
      "noopener,noreferrer",
    );
  }, [link]);

  return (
    <div
      className={`card bg-base-100 border ${config.cardBorder} transition-all duration-200 hover:shadow-lg`}
    >
      <div
        className={`${config.headerBg} ${config.headerText} p-4 rounded-t-xl`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-base-100/20 backdrop-blur-sm rounded-lg">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">{config.title}</h3>
            <p className="opacity-80 text-sm">{config.subtitle}</p>
          </div>
        </div>
      </div>

      <div className="card-body gap-4 p-4">
        <div className="join w-full">
          <div
            className={`join-item flex-1 ${config.inputBg} px-3 py-2 flex items-center overflow-hidden border border-base-300`}
          >
            <code className="text-sm break-all text-base-content/70 font-mono block truncate">
              {link}
            </code>
          </div>
          <button
            onClick={() => onCopy(type)}
            className={`btn join-item ${isCopied ? "btn-success" : config.buttonClass}`}
            aria-label={
              isCopied ? "Copiado" : `Copiar enlace de ${config.title}`
            }
          >
            {isCopied ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {isCopied && (
          <div className="flex items-center gap-2 text-success text-sm font-medium">
            <CheckIcon className="w-4 h-4" />
            <span>¡Copiado!</span>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <QRCodePlaceholder link={link} label="Escanea para acceder" />
        </div>

        <div className="pt-2 border-t border-base-300">
          <p className="text-xs text-base-content/70 mb-3 text-center font-medium uppercase tracking-wide">
            Compartir en redes
          </p>
          <div className="join join-horizontal flex justify-center">
            <button
              onClick={handleWhatsAppShare}
              className="btn btn-sm join-item bg-[#25D366] hover:bg-[#128C7E] text-white border-none"
              aria-label="Compartir en WhatsApp"
            >
              <WhatsAppIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleTwitterShare}
              className="btn btn-sm join-item btn-neutral"
              aria-label="Compartir en X (Twitter)"
            >
              <TwitterIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleFacebookShare}
              className="btn btn-sm join-item bg-[#1877F2] hover:bg-[#166FE5] text-white border-none"
              aria-label="Compartir en Facebook"
            >
              <FacebookIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShareLinks({
  contributorLink,
  observerLink,
  sessionTitle,
}: ShareLinksProps) {
  const [copied, setCopied] = useState<CopiedState>(null);

  const handleCopy = useCallback(
    async (type: LinkType) => {
      const link = type === "contributor" ? contributorLink : observerLink;
      try {
        await navigator.clipboard.writeText(link);
        setCopied(type);
        setTimeout(() => setCopied(null), COPY_FEEDBACK_DURATION_MS);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
      }
    },
    [contributorLink, observerLink],
  );

  const handleCopyAll = useCallback(async () => {
    const text = buildAllLinksText(contributorLink, observerLink, sessionTitle);
    try {
      await navigator.clipboard.writeText(text);
      setCopied("all");
      setTimeout(() => setCopied(null), COPY_FEEDBACK_DURATION_MS);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  }, [contributorLink, observerLink, sessionTitle]);

  const isAllCopied = copied === "all";

  return (
    <section
      className="w-full max-w-3xl mx-auto space-y-6"
      aria-labelledby="share-links-heading"
    >
      <header className="text-center space-y-2">
        <h2
          id="share-links-heading"
          className="text-2xl md:text-3xl font-bold text-base-content"
        >
          Comparte tu historia
        </h2>
        {sessionTitle && (
          <p className="text-lg text-base-content/70 italic">
            &ldquo;{sessionTitle}&rdquo;
          </p>
        )}
        <p className="text-base-content/70">
          Invita a otros a escribir o seguir la creación
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LinkCard
          type="contributor"
          link={contributorLink}
          sessionTitle={sessionTitle}
          copied={copied}
          onCopy={handleCopy}
        />
        <LinkCard
          type="observer"
          link={observerLink}
          sessionTitle={sessionTitle}
          copied={copied}
          onCopy={handleCopy}
        />
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={handleCopyAll}
          className={`btn btn-lg gap-2 ${isAllCopied ? "btn-success" : "btn-outline"}`}
        >
          {isAllCopied ? (
            <>
              <CheckIcon className="w-5 h-5" />
              <span>¡Todo copiado!</span>
            </>
          ) : (
            <>
              <CopyIcon className="w-5 h-5" />
              <span>Copiar ambos enlaces</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
}
