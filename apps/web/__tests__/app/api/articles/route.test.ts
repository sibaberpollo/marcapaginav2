import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/articles/route";
import {
  getAllArticles,
  getFeaturedArticles,
  getArticlesByCategory,
} from "@/lib/articles";

vi.mock("@/lib/articles");

const mockedGetAllArticles = vi.mocked(getAllArticles);
const mockedGetFeaturedArticles = vi.mocked(getFeaturedArticles);
const mockedGetArticlesByCategory = vi.mocked(getArticlesByCategory);

function createMockRequest(url: string): Request {
  return new Request(`http://localhost:3000${url}`);
}

describe("GET /api/articles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns success:true, data:array, count:number", async () => {
    const mockArticles = [
      {
        slug: "test-article",
        title: "Test Article",
        excerpt: "Test excerpt",
        author: { name: "Author", handle: "@author", avatar: "avatar" },
        category: "Test Category",
        categorySlug: "test-category",
        tags: [],
        featured: false,
        publishedAt: "2024-01-01T00:00:00Z",
        readTime: "5 min",
      },
    ];
    mockedGetAllArticles.mockResolvedValue(mockArticles);

    const request = createMockRequest("/api/articles");
    const response = await GET(request);
    const body = await response.json();

    expect(response.ok).toBe(true);
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(typeof body.count).toBe("number");
    expect(body.count).toBe(1);
  });

  it("?featured=true calls getFeaturedArticles with limit", async () => {
    const mockArticles = [
      {
        slug: "featured-article",
        title: "Featured Article",
        excerpt: "Featured excerpt",
        author: { name: "Author", handle: "@author", avatar: "avatar" },
        category: "Test Category",
        categorySlug: "test-category",
        tags: [],
        featured: true,
        publishedAt: "2024-01-01T00:00:00Z",
        readTime: "5 min",
      },
    ];
    mockedGetFeaturedArticles.mockResolvedValue(mockArticles);

    const request = createMockRequest("/api/articles?featured=true");
    const response = await GET(request);

    expect(mockedGetFeaturedArticles).toHaveBeenCalledWith(50);
    expect(response.ok).toBe(true);
  });

  it("?category=el-placer-de-leer calls getArticlesByCategory", async () => {
    const mockArticles = [
      {
        slug: "category-article",
        title: "Category Article",
        excerpt: "Category excerpt",
        author: { name: "Author", handle: "@author", avatar: "avatar" },
        category: "El placer de leer",
        categorySlug: "el-placer-de-leer",
        tags: [],
        featured: false,
        publishedAt: "2024-01-01T00:00:00Z",
        readTime: "5 min",
      },
    ];
    mockedGetArticlesByCategory.mockResolvedValue(mockArticles);

    const request = createMockRequest(
      "/api/articles?category=el-placer-de-leer",
    );
    const response = await GET(request);

    expect(mockedGetArticlesByCategory).toHaveBeenCalledWith(
      "el-placer-de-leer",
    );
    expect(response.ok).toBe(true);
  });

  it("?limit=10 passes 10 to getFeaturedArticles", async () => {
    const mockArticles: Array<{
      slug: string;
      title: string;
      excerpt: string;
      author: { name: string; handle: string; avatar: string };
      category: string;
      categorySlug: string;
      tags: string[];
      featured: boolean;
      publishedAt: string;
      readTime: string;
    }> = [];
    mockedGetFeaturedArticles.mockResolvedValue(mockArticles);

    const request = createMockRequest("/api/articles?featured=true&limit=10");
    const response = await GET(request);

    expect(mockedGetFeaturedArticles).toHaveBeenCalledWith(10);
    expect(response.ok).toBe(true);
  });

  it("returns 500 and error on exception", async () => {
    mockedGetAllArticles.mockRejectedValue(new Error("Test error"));

    const request = createMockRequest("/api/articles");
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.success).toBe(false);
    expect(body.error).toBe("Failed to fetch articles");
  });

  it("combines category filter with limit parameter", async () => {
    const mockArticles = [
      {
        slug: "article-1",
        title: "Article 1",
        excerpt: "Excerpt 1",
        author: { name: "Author", handle: "@author", avatar: "avatar" },
        category: "El placer de leer",
        categorySlug: "el-placer-de-leer",
        tags: [],
        featured: false,
        publishedAt: "2024-01-01T00:00:00Z",
        readTime: "5 min",
      },
      {
        slug: "article-2",
        title: "Article 2",
        excerpt: "Excerpt 2",
        author: { name: "Author", handle: "@author", avatar: "avatar" },
        category: "El placer de leer",
        categorySlug: "el-placer-de-leer",
        tags: [],
        featured: false,
        publishedAt: "2024-01-02T00:00:00Z",
        readTime: "5 min",
      },
    ];
    mockedGetArticlesByCategory.mockResolvedValue(mockArticles);

    const request = createMockRequest(
      "/api/articles?category=el-placer-de-leer&limit=1",
    );
    const response = await GET(request);
    const body = await response.json();

    expect(mockedGetArticlesByCategory).toHaveBeenCalledWith(
      "el-placer-de-leer",
    );
    expect(body.data.length).toBe(1);
    expect(body.count).toBe(1);
  });

  it("returns empty data array when getAllArticles returns []", async () => {
    mockedGetAllArticles.mockResolvedValue([]);

    const request = createMockRequest("/api/articles");
    const response = await GET(request);
    const body = await response.json();

    expect(response.ok).toBe(true);
    expect(body.success).toBe(true);
    expect(body.data).toEqual([]);
    expect(body.count).toBe(0);
  });

  it("response headers include correct content-type", async () => {
    mockedGetAllArticles.mockResolvedValue([]);

    const request = createMockRequest("/api/articles");
    const response = await GET(request);

    expect(response.headers.get("content-type")).toContain("application/json");
  });
});
