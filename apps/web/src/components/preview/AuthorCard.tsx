import { PreviewAuthor } from '@/lib/previews';
import { Avatar } from '@/components';

interface AuthorCardProps {
  author: PreviewAuthor;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  return (
    <section className="py-8">
      <div className="p-6 bg-bg-primary rounded-xl border border-surface-2">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar name={author.name} size="xl" />
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold text-text-primary">
              {author.name}
            </h3>
            {author.bio && (
              <p className="text-text-secondary leading-relaxed">{author.bio}</p>
            )}
            {author.socialLinks && (
              <div className="flex items-center gap-4 pt-2">
                {author.socialLinks.twitter && (
                  <a
                    href={author.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gray hover:text-text-primary transition-colors"
                    title="Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                )}
                {author.socialLinks.instagram && (
                  <a
                    href={author.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gray hover:text-text-primary transition-colors"
                    title="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {author.socialLinks.gumroad && (
                  <a
                    href={author.socialLinks.gumroad}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gray hover:text-text-primary transition-colors"
                    title="Gumroad"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 17.08c-1.352 1.352-3.608 1.352-4.96 0l-5.894-5.894c-1.352-1.352-1.352-3.608 0-4.96s3.608-1.352 4.96 0l.934.934-1.76 1.76-.934-.934c-.488-.488-1.28-.488-1.768 0s-.488 1.28 0 1.768l5.894 5.894c.488.488 1.28.488 1.768 0s.488-1.28 0-1.768l-.934-.934 1.76-1.76.934.934c1.352 1.352 1.352 3.608 0 4.96z" />
                    </svg>
                  </a>
                )}
                {author.website && (
                  <a
                    href={author.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-gray hover:text-text-primary transition-colors"
                    title="Sitio web"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
