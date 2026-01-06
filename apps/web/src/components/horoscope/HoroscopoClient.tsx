'use client';

import {
  zodiacSigns,
  horoscopoData,
  getLiteraryTexts,
  getSignLink,
  signDisplayNames,
} from '@/lib/horoscope-data';
import type { ImplementedSignSlug } from '@/lib/types/horoscope';

// Colores para las efemérides (estáticos para que Tailwind los genere)
const EFEMERIDE_COLORS = [
  {
    bg: 'bg-purple-50',
    bgDark: 'dark:bg-purple-900/20',
    border: 'border-purple-200',
    borderDark: 'dark:border-purple-800/30',
    text: 'text-purple-600',
    textDark: 'dark:text-purple-400',
  },
  {
    bg: 'bg-blue-50',
    bgDark: 'dark:bg-blue-900/20',
    border: 'border-blue-200',
    borderDark: 'dark:border-blue-800/30',
    text: 'text-blue-600',
    textDark: 'dark:text-blue-400',
  },
  {
    bg: 'bg-green-50',
    bgDark: 'dark:bg-green-900/20',
    border: 'border-green-200',
    borderDark: 'dark:border-green-800/30',
    text: 'text-green-600',
    textDark: 'dark:text-green-400',
  },
  {
    bg: 'bg-amber-50',
    bgDark: 'dark:bg-amber-900/20',
    border: 'border-amber-200',
    borderDark: 'dark:border-amber-800/30',
    text: 'text-amber-600',
    textDark: 'dark:text-amber-400',
  },
  {
    bg: 'bg-teal-50',
    bgDark: 'dark:bg-teal-900/20',
    border: 'border-teal-200',
    borderDark: 'dark:border-teal-800/30',
    text: 'text-teal-600',
    textDark: 'dark:text-teal-400',
  },
  {
    bg: 'bg-indigo-50',
    bgDark: 'dark:bg-indigo-900/20',
    border: 'border-indigo-200',
    borderDark: 'dark:border-indigo-800/30',
    text: 'text-indigo-600',
    textDark: 'dark:text-indigo-400',
  },
  {
    bg: 'bg-rose-50',
    bgDark: 'dark:bg-rose-900/20',
    border: 'border-rose-200',
    borderDark: 'dark:border-rose-800/30',
    text: 'text-rose-600',
    textDark: 'dark:text-rose-400',
  },
];

interface HoroscopoClientProps {
  signo?: ImplementedSignSlug;
}

export default function HoroscopoClient({ signo = 'sagitario' }: HoroscopoClientProps) {
  const currentSign = signo;
  const displaySignName = signDisplayNames[signo];
  const literaryTexts = getLiteraryTexts(signo);
  const currentSignText = literaryTexts[currentSign]?.text || '';
  const data = horoscopoData[signo];

  return (
    <div className="relative bg-bg-primary">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-bg-primary py-16 lg:py-24">
        {/* Fondo geométrico sutil */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-20 left-[10%] h-32 w-32 animate-pulse rounded-full bg-brand-yellow/10" />
          <div className="absolute top-40 right-[15%] h-24 w-24 rotate-45 transform bg-brand-yellow/5" />
          <div className="absolute top-60 left-[20%] h-20 w-20 rounded-full bg-surface/50" />
          <div className="absolute top-80 right-[8%] h-28 w-28 rotate-12 transform bg-surface/30" />
        </div>

        <div className="mx-auto max-w-7xl px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Texto literario */}
            <div className="relative order-2 flex flex-col justify-center lg:order-1">
              <div className="mb-4 text-sm font-medium tracking-wide text-text-secondary uppercase">
                Signo: {displaySignName}
              </div>
              <h1 className="mb-4 text-4xl font-bold text-text-primary lg:text-6xl">
                {data.author}
              </h1>
              <p className="mb-8 max-w-lg text-lg leading-relaxed text-text-secondary">
                {data.description}
              </p>
            </div>
            {/* Right Column - Imagen del autor */}
            <div className="relative order-1 flex items-center justify-center lg:order-2">
              <img
                src={data.authorImage}
                alt={data.author}
                className="z-10 h-auto max-h-72 w-64 object-contain"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 bg-bg-primary">
        <div className="py-2">
          {/* Efemérides Literarias Section */}
          <div className="mb-6">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-text-primary">
                Efemérides
              </h3>
              <div className="mx-auto h-1 w-24 rounded-full bg-brand-yellow" />
            </div>

            {/* Scroll horizontal para efemérides */}
            <div className="flex gap-4 overflow-x-auto pb-4">
              {data.efemerides.map((efemeride, index) => {
                const colors = EFEMERIDE_COLORS[index % EFEMERIDE_COLORS.length];
                return (
                  <div key={index} className="w-80 flex-shrink-0">
                    <div
                      className={`rounded-xl border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${colors.bg} ${colors.bgDark} ${colors.border} ${colors.borderDark}`}
                    >
                      <div className={`text-sm font-semibold mb-2 ${colors.text} ${colors.textDark}`}>
                        {efemeride.date}
                      </div>
                      <div className="mb-2 font-bold text-text-primary">
                        {efemeride.title}
                      </div>
                      <p className="text-sm text-text-secondary italic">
                        {efemeride.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grilla de signos literarios */}
          <div className="space-y-8 pt-8">
            {/* Card horizontal del signo del mes */}
            {(() => {
              const currentSignData = zodiacSigns.find((sign) => sign.slug === currentSign);
              return (
                <div className="w-full rounded-xl border-2 border-brand-yellow bg-brand-yellow/10 p-8 shadow-lg">
                  <div className="flex flex-col items-center gap-6 md:flex-row">
                    <div className="flex-shrink-0">
                      {currentSignData?.image ? (
                        <div
                          className="flex h-24 w-24 items-center justify-center rounded-full bg-surface"
                        >
                          <img
                            src={currentSignData.image}
                            alt={`Símbolo de ${currentSignData.name}`}
                            className="h-20 w-20 object-contain"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="text-6xl">{currentSignData?.symbol}</div>
                      )}
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <div className="mb-2 text-3xl font-bold text-text-primary">
                        {currentSignData?.name}
                      </div>
                      <div className="mb-4 text-lg text-text-secondary">
                        {currentSignData?.date}
                      </div>
                      <div className="text-xl leading-relaxed text-text-primary">
                        {currentSignText}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Grid de los demás signos */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {zodiacSigns
                .filter((sign) => sign.slug !== currentSign)
                .map((sign) => {
                  const literaryText = literaryTexts[sign.slug as keyof typeof literaryTexts]?.text || '';
                  const signLink = getSignLink(sign.slug);
                  const isClickable = signLink !== '#';

                  const cardContent = (
                    <div className={`relative bg-bg-primary rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-surface transition-all duration-200 ${
                      isClickable
                        ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer hover:border-brand-yellow'
                        : ''
                    }`}>
                      <div className="mb-2">
                        {sign.image ? (
                          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface">
                            <img
                              src={sign.image}
                              alt={`Símbolo de ${sign.name}`}
                              className="h-12 w-12 object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="text-5xl">{sign.symbol}</div>
                        )}
                      </div>
                      <div className="mb-1 text-lg font-bold text-text-primary">{sign.name}</div>
                      <div className="mb-3 text-sm text-text-secondary">{sign.date}</div>
                      <div className="mb-2 text-base text-text-secondary">
                        {literaryText}
                      </div>
                      {isClickable && (
                        <div className="mt-auto pt-2">
                          <span className="text-xs font-medium text-brand-gray">
                            {['cancer', 'leo', 'virgo', 'libra', 'escorpio'].includes(sign.slug)
                              ? 'Ver archivo'
                              : 'Ver horóscopo'}{' '}
                            →
                          </span>
                        </div>
                      )}
                    </div>
                  );

                  return (
                    <div key={sign.name}>
                      {isClickable ? (
                        <a href={signLink} className="block">
                          {cardContent}
                        </a>
                      ) : (
                        cardContent
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de escritores del signo */}
      {data.writers && (
        <div className="mx-auto max-w-7xl px-4 bg-bg-primary">
          <div className="py-16">
            <div className="mb-8 text-center">
              <h3 className="mb-2 text-2xl font-bold text-text-primary">
                Escritores {displaySignName}
              </h3>
              <div className="mx-auto h-1 w-24 rounded-full bg-brand-yellow" />
            </div>

            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.writers.map((writer, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-surface bg-surface/50 p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <p className="text-sm font-medium text-text-primary">{writer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
