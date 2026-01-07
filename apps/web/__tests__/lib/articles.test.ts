import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as path from "path";
import * as fs from "fs/promises";

vi.mock("fs/promises", async () => {
  const mockFunctions = {
    mkdir: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    readdir: vi.fn<() => Promise<string[]>>().mockResolvedValue([]),
    readFile: vi.fn<() => Promise<string>>().mockResolvedValue(""),
    writeFile: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
    unlink: vi.fn<() => Promise<void>>().mockResolvedValue(undefined),
  };
  return {
    default: mockFunctions,
    ...mockFunctions,
  };
});

import {
  getAllArticles,
  getArticlesByCategory,
  getArticleBySlug,
  getArticleByCategoryAndSlug,
  saveArticle,
  deleteArticle,
  getFeaturedArticles,
  getRelatedArticles,
  getCategoriesWithCounts,
  ensureContentDirectories,
  formatPlainTextToHtml,
} from "@/lib/articles";
import { Article, ArticleSummary, CATEGORIES } from "@/lib/types/article";

describe("articles.ts", () => {
  const testContentDir = path.join(process.cwd(), "content");
  const testCategorySlug = "el-placer-de-leer";
  const testSlug = "test-article";
  const testFilePath = path.join(
    testContentDir,
    testCategorySlug,
    `${testSlug}.json`,
  );

  const mockArticle: Article = {
    slug: testSlug,
    title: "Test Article",
    excerpt: "This is a test excerpt",
    content: "<p>Test content</p>",
    author: {
      name: "Test Author",
      handle: "@testauthor",
      avatar: "https://example.com/avatar.png",
    },
    category: "El placer de leer",
    categorySlug: testCategorySlug,
    tags: ["literatura", "ensayo"],
    featured: true,
    publishedAt: "2024-01-15T10:00:00Z",
    readTime: "5 min",
    likes: 42,
    comments: 5,
  };

  const mockArticleSummary: ArticleSummary = {
    slug: testSlug,
    title: "Test Article",
    excerpt: "This is a test excerpt",
    author: {
      name: "Test Author",
      handle: "@testauthor",
      avatar: "https://example.com/avatar.png",
    },
    category: "El placer de leer",
    categorySlug: testCategorySlug,
    tags: ["literatura", "ensayo"],
    featured: true,
    publishedAt: "2024-01-15T10:00:00Z",
    readTime: "5 min",
    likes: 42,
    comments: 5,
  };

  const mockArticleOld: Article = {
    ...mockArticle,
    slug: "old-article",
    title: "Old Article",
    publishedAt: "2023-01-15T10:00:00Z",
    featured: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("getAllArticles", () => {
    it("returns empty array when readdir fails with ENOENT", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockRejectedValue(
        new Error("ENOENT: no such file or directory"),
      );

      const result = await getAllArticles();

      expect(result).toEqual([]);
    });

    it("returns articles sorted by publishedAt descending (newest first)", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([
        "old-article.json",
        "test-article.json",
      ]);
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(JSON.stringify(mockArticle))
        .mockResolvedValueOnce(JSON.stringify(mockArticleOld));

      const result = await getAllArticles();

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("test-article");
      expect(result[1].slug).toBe("old-article");
    });

    it("calls getArticlesByCategory for each category in CATEGORIES", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([]);

      await getAllArticles();

      expect(vi.mocked(fs.readdir)).toHaveBeenCalledTimes(CATEGORIES.length);
    });

    it("returns empty array when all categories are empty", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([]);

      const result = await getAllArticles();

      expect(result).toEqual([]);
    });
  });

  describe("getArticlesByCategory", () => {
    it("returns empty array when readdir returns empty array", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([]);

      const result = await getArticlesByCategory(testCategorySlug);

      expect(result).toEqual([]);
    });

    it("returns empty array when readdir throws error (catches and returns [])", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockRejectedValue(new Error("ENOENT"));

      const result = await getArticlesByCategory(testCategorySlug);

      expect(result).toEqual([]);
    });

    it("parses JSON files correctly into ArticleSummary", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue(["test-article.json"]);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockArticle));

      const result = await getArticlesByCategory(testCategorySlug);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(mockArticleSummary);
    });

    it("sorts articles by publishedAt descending", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([
        "test-article.json",
        "old-article.json",
      ]);
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(JSON.stringify(mockArticle))
        .mockResolvedValueOnce(JSON.stringify(mockArticleOld));

      const result = await getArticlesByCategory(testCategorySlug);

      expect(result).toHaveLength(2);
      expect(result[0].slug).toBe("test-article");
      expect(result[1].slug).toBe("old-article");
    });

    it("ignores non-JSON files", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([
        "test.md",
        "image.png",
        "data.json",
      ]);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockArticle));

      const result = await getArticlesByCategory(testCategorySlug);

      expect(result).toHaveLength(1);
      expect(vi.mocked(fs.readFile)).toHaveBeenCalledTimes(1);
    });
  });

  describe("getArticleBySlug", () => {
    it("returns null when all category lookups fail (readFile throws for all)", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("ENOENT"));

      const result = await getArticleBySlug("nonexistent");

      expect(result).toBeNull();
    });

    it("returns null when file does not exist in category directory", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockRejectedValue(new Error("ENOENT"));

      const result = await getArticleBySlug("nonexistent");

      expect(result).toBeNull();
    });

    it("returns Article when found in filesystem", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockArticle));

      const result = await getArticleBySlug(testSlug);

      expect(result).toEqual(mockArticle);
    });
  });

  describe("getArticleByCategoryAndSlug", () => {
    it("returns Article when file exists in category directory", async () => {
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockArticle));

      const result = await getArticleByCategoryAndSlug(
        testCategorySlug,
        testSlug,
      );

      expect(result).toEqual(mockArticle);
    });

    it("returns null when file does not exist (readFile throws)", async () => {
      vi.mocked(fs.readFile).mockRejectedValue(new Error("ENOENT"));

      const result = await getArticleByCategoryAndSlug(
        testCategorySlug,
        "nonexistent",
      );

      expect(result).toBeNull();
    });

    it("correctly parses full Article with content field", async () => {
      const articleWithContent: Article = {
        ...mockArticle,
        content: "<p>Full content here with <strong>HTML</strong></p>",
      };
      vi.mocked(fs.readFile).mockResolvedValue(
        JSON.stringify(articleWithContent),
      );

      const result = await getArticleByCategoryAndSlug(
        testCategorySlug,
        testSlug,
      );

      expect(result?.content).toBe(
        "<p>Full content here with <strong>HTML</strong></p>",
      );
    });
  });

  describe("saveArticle", () => {
    it("returns true when writeFile succeeds", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      const result = await saveArticle(mockArticle);

      expect(result).toBe(true);
    });

    it("returns false when writeFile throws error", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockRejectedValue(new Error("Write error"));

      const result = await saveArticle(mockArticle);

      expect(result).toBe(false);
    });

    it("writes correct file path (content/{categorySlug}/{slug}.json)", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await saveArticle(mockArticle);

      expect(vi.mocked(fs.writeFile)).toHaveBeenCalledWith(
        testFilePath,
        expect.any(String),
        "utf-8",
      );
    });

    it("writes valid JSON with all Article fields", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);

      await saveArticle(mockArticle);

      const writeCall = vi.mocked(fs.writeFile).mock.calls[0];
      const writtenContent = JSON.parse((writeCall[1] as string) || "{}");

      expect(writtenContent.slug).toBe(mockArticle.slug);
      expect(writtenContent.title).toBe(mockArticle.title);
      expect(writtenContent.excerpt).toBe(mockArticle.excerpt);
      expect(writtenContent.content).toBe(mockArticle.content);
      expect(writtenContent.category).toBe(mockArticle.category);
      expect(writtenContent.categorySlug).toBe(mockArticle.categorySlug);
      expect(writtenContent.tags).toEqual(mockArticle.tags);
      expect(writtenContent.featured).toBe(mockArticle.featured);
      expect(writtenContent.publishedAt).toBe(mockArticle.publishedAt);
    });
  });

  describe("deleteArticle", () => {
    it("returns true when unlink succeeds", async () => {
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      const result = await deleteArticle(testCategorySlug, testSlug);

      expect(result).toBe(true);
    });

    it("returns false when unlink throws ENOENT", async () => {
      vi.mocked(fs.unlink).mockRejectedValue(
        new Error("ENOENT: no such file or directory"),
      );

      const result = await deleteArticle(testCategorySlug, "nonexistent");

      expect(result).toBe(false);
    });

    it("calls unlink with correct path", async () => {
      vi.mocked(fs.unlink).mockResolvedValue(undefined);

      await deleteArticle(testCategorySlug, testSlug);

      expect(vi.mocked(fs.unlink)).toHaveBeenCalledWith(testFilePath);
    });
  });

  describe("getFeaturedArticles", () => {
    it("filters articles by featured: true", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockImplementation((path) => {
        const p = path as string;
        if (p.includes("el-placer-de-leer")) {
          return Promise.resolve([
            "test-article.json",
            "old-article.json",
          ]) as Promise<string[]>;
        }
        return Promise.resolve([]) as Promise<string[]>;
      });
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(JSON.stringify(mockArticle))
        .mockResolvedValueOnce(JSON.stringify(mockArticleOld));

      const result = await getFeaturedArticles();

      expect(result).toHaveLength(1);
      expect(result[0].featured).toBe(true);
    });

    it("respects limit parameter", async () => {
      const featuredArticle1 = {
        ...mockArticle,
        slug: "featured-1",
        title: "Featured 1",
      };
      const featuredArticle2 = {
        ...mockArticle,
        slug: "featured-2",
        title: "Featured 2",
      };
      const featuredArticle3 = {
        ...mockArticle,
        slug: "featured-3",
        title: "Featured 3",
      };

      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([
        "featured-1.json",
        "featured-2.json",
        "featured-3.json",
      ]);
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(JSON.stringify(featuredArticle1))
        .mockResolvedValueOnce(JSON.stringify(featuredArticle2))
        .mockResolvedValueOnce(JSON.stringify(featuredArticle3));

      const result = await getFeaturedArticles(2);

      expect(result).toHaveLength(2);
    });

    it("returns empty array when no featured articles exist", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue(["old-article.json"]);
      vi.mocked(fs.readFile).mockResolvedValue(JSON.stringify(mockArticleOld));

      const result = await getFeaturedArticles();

      expect(result).toEqual([]);
    });
  });

  describe("getRelatedArticles", () => {
    it("excludes current article from results (slug !== article.slug)", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([
        "test-article.json",
        "old-article.json",
      ]);
      vi.mocked(fs.readFile)
        .mockResolvedValueOnce(JSON.stringify(mockArticle))
        .mockResolvedValueOnce(JSON.stringify(mockArticleOld));

      const result = await getRelatedArticles(mockArticle);

      expect(result.every((a) => a.slug !== mockArticle.slug)).toBe(true);
    });

    it("returns empty array when no related articles found", async () => {
      const unrelatedArticle: Article = {
        ...mockArticle,
        slug: "unrelated",
        categorySlug: "other-category",
        tags: ["otro", "diferente"],
      };

      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue(["unrelated.json"]);
      vi.mocked(fs.readFile).mockResolvedValue(
        JSON.stringify(unrelatedArticle),
      );

      const result = await getRelatedArticles(mockArticle);

      expect(result).toEqual([]);
    });

    it("respects limit parameter", async () => {
      const articles = Array.from({ length: 5 }, (_, i) => ({
        ...mockArticle,
        slug: `related-${i}`,
        categorySlug: testCategorySlug,
        tags: [],
      }));

      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue(
        articles.map((a) => `${a.slug}.json`),
      );
      articles.forEach((a) =>
        vi.mocked(fs.readFile).mockResolvedValueOnce(JSON.stringify(a)),
      );

      const result = await getRelatedArticles(mockArticle, 3);

      expect(result).toHaveLength(3);
    });
  });

  describe("getCategoriesWithCounts", () => {
    it("returns all 6 categories with count property", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([]);

      const result = await getCategoriesWithCounts();

      expect(result).toHaveLength(6);
      expect(result.every((c) => "count" in c)).toBe(true);
    });

    it("count is 0 when category has no articles", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([]);

      const result = await getCategoriesWithCounts();

      expect(result.every((c) => c.count === 0)).toBe(true);
    });

    it("uses Promise.all for parallel execution", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);
      vi.mocked(fs.readdir).mockResolvedValue([]);

      await getCategoriesWithCounts();

      expect(vi.mocked(fs.readdir)).toHaveBeenCalledTimes(CATEGORIES.length);
    });
  });

  describe("formatPlainTextToHtml", () => {
    it("returns empty string for empty input", () => {
      const result = formatPlainTextToHtml("");
      expect(result).toBe("");
    });

    it("returns empty string for whitespace-only input", () => {
      const result = formatPlainTextToHtml("   \n\t\n   ");
      expect(result).toBe("");
    });

    it("wraps single paragraph in <p> tags", () => {
      const result = formatPlainTextToHtml("Hello world");
      expect(result).toBe("<p>Hello world</p>");
    });

    it("splits on \\n\\n+ for multiple paragraphs", () => {
      const result = formatPlainTextToHtml(
        "First paragraph\n\nSecond paragraph",
      );
      expect(result).toContain("<p>First paragraph</p>");
      expect(result).toContain("<p>Second paragraph</p>");
    });

    it("replaces \\n with <br /> within paragraphs", () => {
      const result = formatPlainTextToHtml("Line one\nLine two");
      expect(result).toBe("<p>Line one<br />Line two</p>");
    });

    it("handles multiple paragraphs with internal newlines", () => {
      const result = formatPlainTextToHtml(
        "Para one\nline one\nline two\n\nPara two\nline a\nline b",
      );
      expect(result).toContain("<p>Para one<br />line one<br />line two</p>");
      expect(result).toContain("<p>Para two<br />line a<br />line b</p>");
    });
  });

  describe("ensureContentDirectories", () => {
    it("creates base content directory recursively", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);

      await ensureContentDirectories();

      expect(vi.mocked(fs.mkdir)).toHaveBeenCalledWith(testContentDir, {
        recursive: true,
      });
    });

    it("creates subdirectory for each category in CATEGORIES", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);

      await ensureContentDirectories();

      CATEGORIES.forEach((category) => {
        const categoryDir = path.join(testContentDir, category.slug);
        expect(vi.mocked(fs.mkdir)).toHaveBeenCalledWith(categoryDir, {
          recursive: true,
        });
      });
    });

    it("is idempotent (calling twice does not throw)", async () => {
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);

      await expect(ensureContentDirectories()).resolves.not.toThrow();
      await expect(ensureContentDirectories()).resolves.not.toThrow();

      const callCount = vi.mocked(fs.mkdir).mock.calls.length;
      expect(callCount).toBeGreaterThanOrEqual(CATEGORIES.length + 1);
    });
  });
});
