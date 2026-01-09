import Link from "next/link";
import Avatar from "./Avatar";

interface PostCardProps {
  title: string;
  excerpt: string;
  author: string;
  timeAgo: string;
  tags: string[];
  readTime: string;
  slug?: string;
}

export default function PostCard({
  title,
  excerpt,
  author,
  timeAgo,
  tags,
  readTime,
  slug,
}: PostCardProps) {
  return (
    <article className="bg-bg-primary rounded-lg p-5 border border-surface-2 hover:border-brand-gray/30 transition-colors">
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Avatar name={author} size="xs" />
            <span className="text-sm font-medium">{author}</span>
            <span className="text-xs text-text-secondary">{timeAgo}</span>
          </div>
          <h3 className="text-lg font-bold leading-snug mb-2">
            <Link
              href={slug ? `/articulo/${slug}` : "#"}
              className="hover:text-brand-gray transition-colors"
            >
              {title}
            </Link>
          </h3>
          <p className="text-sm text-text-secondary line-clamp-2 mb-3">
            {excerpt}
          </p>
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
            <span className="text-xs font-mono text-text-secondary">{readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
