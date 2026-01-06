import Link from 'next/link';

export default function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-surface-2 z-50">
      <div className="flex justify-around py-2">
        {/* Inicio */}
        <Link href="/" className="flex flex-col items-center gap-1 p-2 text-text-primary">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="text-xs font-medium">Inicio</span>
        </Link>

        {/* Artículos */}
        <Link href="/articulos" className="flex flex-col items-center gap-1 p-2 text-brand-gray">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
          <span className="text-xs">Artículos</span>
        </Link>

        {/* Narrativa */}
        <Link href="/transtextos" className="flex flex-col items-center gap-1 p-2 text-brand-gray">
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xs">T</span>
          </div>
          <span className="text-xs">Narrativa</span>
        </Link>

        {/* Horóscopo */}
        <Link href="/horoscopo" className="flex flex-col items-center gap-1 p-2 text-brand-gray">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 3v4m0 10v4M3 12h4m10 0h4m-4.93-6.36l-2.83 2.83m-4.48 4.48l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83"
            />
          </svg>
          <span className="text-xs">Horóscopo</span>
        </Link>
      </div>
    </nav>
  );
}
