import { render } from "@testing-library/react";
import ArticleSchema from "@/components/seo/ArticleSchema";
import { Article } from "@/lib/types/article";

const mockArticle: Article = {
  slug: "test-article",
  title: "Test Article Title",
  excerpt: "This is a test excerpt for the article",
  content: "<p>Article content here</p>",
  author: {
    name: "Juan Pérez",
    handle: "@juanperez",
    avatar: "/avatar.jpg",
    bio: "Writer and critic",
  },
  category: "El placer de leer",
  categorySlug: "el-placer-de-leer",
  tags: ["literatura", "ensayo", "cultura"],
  featured: true,
  publishedAt: "2024-03-15T10:00:00Z",
  updatedAt: "2024-03-20T14:30:00Z",
  readTime: "5 min",
  likes: 42,
  comments: 15,
};

const getJsonLd = (container: HTMLElement) => {
  const script = container.querySelector('script[type="application/ld+json"]');
  return JSON.parse(script?.textContent || "{}");
};

describe("ArticleSchema", () => {
  it("Renders script type='application/ld+json'", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const script = container.querySelector(
      'script[type="application/ld+json"]',
    );
    expect(script).toBeInTheDocument();
  });

  it("JSON-LD has @context 'https://schema.org'", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd["@context"]).toBe("https://schema.org");
  });

  it("JSON-LD has @type 'Article'", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd["@type"]).toBe("Article");
  });

  it("Headline equals article.title", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.headline).toBe("Test Article Title");
  });

  it("Description equals article.excerpt", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.description).toBe("This is a test excerpt for the article");
  });

  it("URL constructed correctly (articulo/{slug})", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.url).toBe("https://marcapagina.page/articulo/test-article");
  });

  it("DatePublished uses article.publishedAt", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.datePublished).toBe("2024-03-15T10:00:00Z");
  });

  it("Author object has @type 'Person' and correct name", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.author["@type"]).toBe("Person");
    expect(jsonLd.author.name).toBe("Juan Pérez");
  });

  it("Publisher object has @type 'Organization' and correct logo URL", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.publisher["@type"]).toBe("Organization");
    expect(jsonLd.publisher.logo.url).toBe(
      "https://marcapagina.page/og-image.png",
    );
  });

  it("ArticleSection equals article.category", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.articleSection).toBe("El placer de leer");
  });

  it("Keywords joined with commas", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.keywords).toBe("literatura, ensayo, cultura");
  });

  it("InLanguage equals 'es-ES'", () => {
    const { container } = render(<ArticleSchema article={mockArticle} />);
    const jsonLd = getJsonLd(container);
    expect(jsonLd.inLanguage).toBe("es-ES");
  });

  it("Works with type='relato' prop (uses 'relato' in URL)", () => {
    const { container } = render(
      <ArticleSchema article={mockArticle} type="relato" />,
    );
    const jsonLd = getJsonLd(container);
    expect(jsonLd.url).toBe("https://marcapagina.page/relato/test-article");
  });

  it("Falls back to publishedAt when updatedAt is undefined", () => {
    const articleWithoutUpdate: Article = {
      ...mockArticle,
      updatedAt: undefined,
    };
    const { container } = render(
      <ArticleSchema article={articleWithoutUpdate} />,
    );
    const jsonLd = getJsonLd(container);
    expect(jsonLd.dateModified).toBe("2024-03-15T10:00:00Z");
  });
});
