import { NextResponse } from 'next/server';
import { getArticleBySlug, getRelatedArticles } from '@/lib/articles';

interface Params {
    params: Promise<{ slug: string }>;
}

export async function GET(request: Request, { params }: Params) {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const includeRelated = searchParams.get('related') === 'true';

    try {
        const article = await getArticleBySlug(slug);

        if (!article) {
            return NextResponse.json(
                { success: false, error: 'Article not found' },
                { status: 404 }
            );
        }

        let related = null;
        if (includeRelated) {
            related = await getRelatedArticles(article, 4);
        }

        return NextResponse.json({
            success: true,
            data: article,
            related,
        });
    } catch (error) {
        console.error(`Error fetching article ${slug}:`, error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch article' },
            { status: 500 }
        );
    }
}
