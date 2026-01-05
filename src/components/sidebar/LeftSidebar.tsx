import Link from 'next/link';
import AdBanner from '../ads/AdBanner';

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
    href: '/narrativa',
    label: 'Narrativa',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
  },
  {
    href: '/noticias',
    label: 'Noticias',
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
    href: '/apps',
    label: 'Apps',
    icon: (
      <>
        <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </>
    ),
    fill: true,
  },
  {
    href: '/guardados',
    label: 'Guardados',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
      />
    ),
  },
  {
    href: '/transtextos',
    label: 'Transtextos',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 6v12m-7-9h7M5 6h7a4 4 0 014 4v8a1 1 0 01-1 1H9a4 4 0 01-4-4V6z"
      />
    ),
  },
  {
    href: '/tags',
    label: 'Tags',
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
      />
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
            <svg
              className="w-5 h-5"
              fill={item.fill ? 'currentColor' : 'none'}
              stroke={item.fill ? 'none' : 'currentColor'}
              viewBox="0 0 24 24"
            >
              {item.icon}
            </svg>
            {item.label}
          </Link>
        ))}

        {/* Ad Banner */}
        <div className="mt-4 pt-4 border-t border-surface-2">
          <AdBanner size="medium-rectangle" />
        </div>

        {/* Popular Tags */}
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
      </nav>
    </aside>
  );
}
