import type { ReactNode } from 'react';
import { LeftSidebar, RightSidebar } from '@/components';

interface ArticlePageLayoutProps {
  children: ReactNode;
}

export default function ArticlePageLayout({ children }: ArticlePageLayoutProps) {
  return (
    <main className="min-h-screen pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[240px_1fr_320px] gap-6">
          <LeftSidebar />

          <div className="max-w-3xl w-full mx-auto">{children}</div>

          <RightSidebar />
        </div>
      </div>
    </main>
  );
}
