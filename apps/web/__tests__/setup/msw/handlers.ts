import { http, HttpResponse } from "msw";
import { Article, ArticleSummary, CATEGORIES } from "@/lib/types/article";

const MOCK_ARTICLES: Article[] = [
  {
    slug: "manual-de-usuario-para-comenzar-a-leer",
    title: "Manual de usuario para comenzar a leer",
    excerpt:
      "Una guía imprescindible para aquellos que desean sumergirse en el mundo de la literatura pero no saben por dónde empezar.",
    content:
      "<p>Contenido completo del artículo sobre cómo comenzar a leer literatura...</p>",
    author: {
      name: "María García",
      handle: "maria-garcia",
      avatar: "/static/images/authors/maria.jpg",
      bio: "Crítica literaria y docente de literatura comparada.",
    },
    category: "El placer de leer",
    categorySlug: "el-placer-de-leer",
    tags: ["literatura", "lectura", "guía"],
    featured: true,
    publishedAt: "2025-01-15T10:00:00Z",
    readTime: "8 min",
    likes: 156,
    comments: 23,
  },
  {
    slug: "la-paris-de-hemingway",
    title: "La París de Hemingway",
    excerpt:
      "Un recorrido literario por los lugares que inspiraron las obras maestra del escritor estadounidense en la Ciudad Luz.",
    content: "<p>Contenido completo sobre París y Hemingway...</p>",
    author: {
      name: "Carlos Ruiz",
      handle: "carlos-ruiz",
      avatar: "/static/images/authors/carlos.jpg",
      bio: "Escritor y cronista cultural.",
    },
    category: "A pie de página",
    categorySlug: "a-pie-de-pagina",
    tags: ["viajes", "literatura", "parís", "hemingway"],
    featured: true,
    publishedAt: "2025-01-10T14:30:00Z",
    readTime: "12 min",
    likes: 234,
    comments: 45,
  },
  {
    slug: "ensayo-sobre-la-soledad",
    title: "Ensayo sobre la soledad en la literatura contemporánea",
    excerpt:
      "Análisis de cómo los autores contemporáneos abordan el tema de la soledad en sus obras.",
    content: "<p>Contenido del ensayo sobre soledad...</p>",
    author: {
      name: "Ana Martínez",
      handle: "ana-martinez",
      avatar: "/static/images/authors/ana.jpg",
      bio: "Profesora de literatura y ensayista.",
    },
    category: "Crítica",
    categorySlug: "critica",
    tags: ["ensayo", "literatura contemporánea", "soledad"],
    featured: false,
    publishedAt: "2025-01-08T09:15:00Z",
    readTime: "15 min",
    likes: 89,
    comments: 12,
  },
  {
    slug: "reseña-novela-invierno",
    title: 'Reseña: "El invierno del mundo"',
    excerpt:
      "Una mirada crítica a la última novela del autor español que ha conquistado a críticos y lectores.",
    content: "<p>Contenido de la reseña...</p>",
    author: {
      name: "Pedro Sánchez",
      handle: "pedro-sanchez",
      avatar: "/static/images/authors/pedro.jpg",
      bio: "Crítico literario especializado en narrativa española.",
    },
    category: "Reseñas",
    categorySlug: "resenas",
    tags: ["reseña", "novela", "literatura española"],
    featured: false,
    publishedAt: "2025-01-05T16:45:00Z",
    readTime: "6 min",
    likes: 67,
    comments: 8,
  },
];

const MOCK_ARTICLE_SUMMARIES: ArticleSummary[] = MOCK_ARTICLES.map(
  (article) => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    author: {
      name: article.author.name,
      handle: article.author.handle,
      avatar: article.author.avatar,
    },
    category: article.category,
    categorySlug: article.categorySlug,
    tags: article.tags,
    featured: article.featured,
    publishedAt: article.publishedAt,
    readTime: article.readTime,
    likes: article.likes,
    comments: article.comments,
  }),
);

export const handlers = [
  http.get("/api/articles", ({ request }) => {
    const url = new URL(request.url);
    const featured = url.searchParams.get("featured");
    const category = url.searchParams.get("category");
    const limit = url.searchParams.get("limit");

    let articles = [...MOCK_ARTICLE_SUMMARIES];

    if (featured === "true") {
      articles = articles.filter((a) => a.featured);
    }

    if (category) {
      articles = articles.filter((a) => a.categorySlug === category);
    }

    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum)) {
        articles = articles.slice(0, limitNum);
      }
    }

    return HttpResponse.json({ articles });
  }),

  http.get("/api/categories", () => {
    return HttpResponse.json({ categories: CATEGORIES });
  }),

  http.get("/api/articles/:slug", ({ params }) => {
    const { slug } = params;
    const article = MOCK_ARTICLES.find((a) => a.slug === slug);

    if (!article) {
      return HttpResponse.json(
        {
          found: false,
          error: "Article not found",
          article: undefined as unknown as Article,
        },
        { status: 404 },
      );
    }

    return HttpResponse.json({
      found: true,
      article,
      error: undefined as string | undefined,
    });
  }),

  http.get("*", () => {
    return HttpResponse.json({ error: "Not found" }, { status: 404 });
  }),
] as const;
