import { NextResponse } from 'next/server';
import { CATEGORIES, getCategoriesWithCounts } from '@/lib/articles';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const withCounts = searchParams.get('counts') === 'true';

    try {
        if (withCounts) {
            const categoriesWithCounts = await getCategoriesWithCounts();
            return NextResponse.json({
                success: true,
                data: categoriesWithCounts,
            });
        }

        return NextResponse.json({
            success: true,
            data: CATEGORIES,
        });
    } catch (error) {
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
