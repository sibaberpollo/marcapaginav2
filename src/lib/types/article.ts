// Types for the article system

export interface Author {
    name: string;
    handle: string;
    avatar: string;
    bio?: string;
}

export interface Article {
    slug: string;
    title: string;
    excerpt: string;
    content: string; // HTML content
    author: Author;
    category: string;
    categorySlug: string;
    tags: string[];
    featured: boolean;
    publishedAt: string; // ISO date string
    updatedAt?: string;
    readTime: string;
    likes?: number;
    comments?: number;
}

export interface ArticleSummary {
    slug: string;
    title: string;
    excerpt: string;
    author: Pick<Author, 'name' | 'handle' | 'avatar'>;
    category: string;
    categorySlug: string;
    tags: string[];
    featured: boolean;
    publishedAt: string;
    readTime: string;
    likes?: number;
    comments?: number;
}

export interface Category {
    name: string;
    slug: string;
    description: string;
}

// Available categories
export const CATEGORIES: Category[] = [
    {
        name: 'El placer de leer',
        slug: 'el-placer-de-leer',
        description: 'Reflexiones y ensayos sobre la experiencia de la lectura',
    },
    {
        name: 'A pie de página',
        slug: 'a-pie-de-pagina',
        description: 'Viajes, literatura y cultura',
    },
    {
        name: 'Crítica',
        slug: 'critica',
        description: 'Análisis crítico de obras literarias',
    },
    {
        name: 'Reseñas',
        slug: 'resenas',
        description: 'Reseñas de libros y publicaciones',
    },
    {
        name: 'Entrevistas',
        slug: 'entrevistas',
        description: 'Conversaciones con autores y figuras del mundo literario',
    },
    {
        name: 'Columnas',
        slug: 'columnas',
        description: 'Opinión y columnas de nuestros colaboradores',
    },
];

export function getCategoryBySlug(slug: string): Category | undefined {
    return CATEGORIES.find((cat) => cat.slug === slug);
}
