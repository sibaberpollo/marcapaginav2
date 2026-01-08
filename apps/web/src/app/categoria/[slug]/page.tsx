import { notFound } from 'next/navigation';
import { LeftSidebar, RightSidebar, CategoryFeed } from '@/components';
import { getArticlesByCategory } from '@/lib/articles';
import { getCategoryBySlug, CATEGORIES } from '@/lib/types/article';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      title: 'Categoría no encontrada',
    };
  }

  return {
    title: `${category.name} | Marcapágina`,
    description: category.description,
    openGraph: {
      title: `${category.name} | Marcapágina`,
      description: category.description,
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const articles = await getArticlesByCategory(slug);

  return (
    <main className="min-h-screen pb-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-[240px_1fr_320px] gap-6">
          <LeftSidebar />
          <CategoryFeed articles={articles} categoryName={category.name} />
          <RightSidebar />
        </div>
      </div>
    </main>
  );
}
