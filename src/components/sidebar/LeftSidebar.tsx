import Link from 'next/link';

const navItems = [
  {
    href: '/',
    label: 'Inicio',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
    active: true,
  },
  {
    href: '/articulos',
    label: 'Artículos',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    ),
  },
  {
    href: '/transtextos',
    label: 'Narrativa',
    customIcon: true,
  },
  {
    href: '/horoscopo',
    label: 'Horóscopo',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" strokeWidth="2" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 3v4m0 10v4M3 12h4m10 0h4m-4.93-6.36l-2.83 2.83m-4.48 4.48l-2.83 2.83m0-10.14l2.83 2.83m4.48 4.48l2.83 2.83"
        />
      </>
    ),
  },
];

const popularTags = ['cuento', 'poesía', 'microrrelato', 'ensayo', 'novela'];

export default function LeftSidebar() {
  return (
    <aside className="hidden lg:block">
      <nav className="sticky top-20 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              item.active
                ? 'bg-bg-primary text-text-primary'
                : 'text-text-secondary hover:text-text-primary hover:bg-bg-primary'
            }`}
          >
            {item.customIcon ? (
              <div className="w-5 h-5 bg-black rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-[10px]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>T.</span>
              </div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {item.icon}
              </svg>
            )}
            {item.label}
          </Link>
        ))}

        {/* Popular Tags 
        <div className="pt-4 border-t border-surface-2 mt-4">
          <h3 className="px-3 text-xs font-semibold text-brand-gray uppercase tracking-wider mb-2">
            Tags populares
          </h3>
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${tag}`}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-primary rounded-lg transition-colors"
            >
              <span className="text-text-primary font-semibold">#</span>
              {tag}
            </Link>
          ))}
        </div>
        */}
      </nav>
    </aside>
  );
}
