import { describe, expect, it } from "vitest";
import {
  CATEGORIES,
  getCategoryBySlug,
  isTravelGuide,
  ArticleSummary,
  Category,
} from "../../src/lib/types/article";
import type { Article, TravelGuide } from "../../src/lib/types/article";

describe("lib/types/article.ts", () => {
  describe("CATEGORIES", () => {
    it("has exactly 8 items", () => {
      expect(CATEGORIES).toHaveLength(8);
    });

    it("each category has name, slug, description properties", () => {
      for (const category of CATEGORIES) {
        expect(category).toHaveProperty("name");
        expect(category).toHaveProperty("slug");
        expect(category).toHaveProperty("description");
        expect(typeof category.name).toBe("string");
        expect(typeof category.slug).toBe("string");
        expect(typeof category.description).toBe("string");
      }
    });
  });

  describe("getCategoryBySlug", () => {
    it("returns category when found (test el-placer-de-leer)", () => {
      const category = getCategoryBySlug("el-placer-de-leer");
      expect(category).toBeDefined();
      expect(category?.slug).toBe("el-placer-de-leer");
      expect(category?.name).toBe("El placer de leer");
    });

    it("returns undefined for non-existent slug", () => {
      const category = getCategoryBySlug("non-existent-slug");
      expect(category).toBeUndefined();
    });
  });

  describe("isTravelGuide", () => {
    it("returns false for standard Article type", () => {
      const article: Article = {
        slug: "test-article",
        title: "Test Article",
        excerpt: "Test excerpt",
        content: "<p>Test content</p>",
        author: {
          name: "Test Author",
          handle: "testauthor",
          avatar: "/avatar.png",
        },
        category: "Test Category",
        categorySlug: "test-category",
        tags: [],
        featured: false,
        publishedAt: "2025-01-01",
        readTime: "5 min",
        type: "standard",
      };
      expect(isTravelGuide(article)).toBe(false);
    });

    it("returns true for TravelGuide type with locations array", () => {
      const travelGuide: TravelGuide = {
        slug: "test-travel-guide",
        title: "Test Travel Guide",
        excerpt: "Test excerpt",
        content: "<p>Test content</p>",
        author: {
          name: "Test Author",
          handle: "testauthor",
          avatar: "/avatar.png",
        },
        category: "Test Category",
        categorySlug: "test-category",
        tags: [],
        featured: false,
        publishedAt: "2025-01-01",
        readTime: "10 min",
        type: "travel-guide",
        locations: [
          {
            id: "loc-1",
            name: "Location 1",
            description: "Location description",
            coordinates: [40.0, -3.0],
            order: 1,
          },
        ],
      };
      expect(isTravelGuide(travelGuide)).toBe(true);
    });
  });

  describe("ArticleSummary", () => {
    it("correctly extracts from Article", () => {
      const article: Article = {
        slug: "test-article",
        title: "Test Article",
        excerpt: "Test excerpt",
        content: "<p>Test content</p>",
        author: {
          name: "Test Author",
          handle: "testauthor",
          avatar: "/avatar.png",
          bio: "Test bio",
        },
        category: "Test Category",
        categorySlug: "test-category",
        tags: ["tag1", "tag2"],
        featured: true,
        publishedAt: "2025-01-01",
        readTime: "5 min",
        likes: 10,
        comments: 5,
      };

      const summary: ArticleSummary = {
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
      };

      expect(summary.slug).toBe("test-article");
      expect(summary.title).toBe("Test Article");
      expect(summary.author.name).toBe("Test Author");
      expect(summary.tags).toHaveLength(2);
      expect(summary.featured).toBe(true);
    });
  });

  describe("Category type", () => {
    it("matches expected structure", () => {
      const category: Category = {
        name: "Test Category",
        slug: "test-category",
        description: "Test description",
      };

      expect(category).toEqual({
        name: "Test Category",
        slug: "test-category",
        description: "Test description",
      });
    });
  });
});
