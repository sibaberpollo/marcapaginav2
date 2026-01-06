import Link from 'next/link';

interface NewsCardProps {
  category: string;
  title: string;
  date: string;
}

export default function NewsCard({ category, title, date }: NewsCardProps) {
  return (
    <article className="bg-bg-primary rounded-lg p-5 border-l-4 border-l-brand-yellow border border-surface-2">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-brand-yellow/20 rounded-lg">
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <span className="text-xs font-semibold text-brand-gray uppercase tracking-wider">
            Noticias · {category}
          </span>
          <h3 className="text-base font-bold leading-snug mt-1">
            <Link href="#" className="hover:text-brand-yellow transition-colors">
              {title}
            </Link>
          </h3>
          <span className="text-xs text-brand-gray mt-2 block">{date}</span>
        </div>
      </div>
    </article>
  );
}
