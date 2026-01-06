import Link from 'next/link';

interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  authorColor: string;
  timeAgo: string;
  tags: string[];
  likes: number;
  comments: number;
  readTime: string;
}

export default function PostCard({
  title,
  excerpt,
  author,
  authorColor,
  timeAgo,
  tags,
  likes,
  comments,
  readTime,
}: PostCardProps) {
  return (
    <article className="bg-bg-primary rounded-lg p-5 border border-surface-2 hover:border-brand-gray/30 transition-colors">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-6 h-6 ${authorColor} rounded-full`}></div>
            <span className="text-sm font-medium">{author}</span>
            <span className="text-xs text-text-secondary">{timeAgo}</span>
          </div>
          <h3 className="text-lg font-bold leading-snug mb-2">
            <Link href="#" className="hover:text-brand-yellow transition-colors">
              {title}
            </Link>
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">{excerpt}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tag/${tag}`}
                className="text-xs px-2 py-1 bg-surface rounded hover:bg-surface-2 transition-colors"
              >
                #{tag}
              </Link>
            ))}
            <div className="flex-1"></div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                {likes}
              </button>
              <button className="flex items-center gap-1 hover:text-text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                {comments}
              </button>
              <button className="hover:text-text-primary transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
              <span className="text-xs font-mono">{readTime}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
