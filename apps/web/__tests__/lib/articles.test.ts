import {
  getAllArticles,
  getArticlesByCategory,
  getArticleBySlug,
  getFeaturedArticles,
  getRelatedArticles,
  getCategoriesWithCounts,
  formatPlainTextToHtml,
} from "@/lib/articles";

// Mock fetch for HTTP-based functions
const mockFetch = vi.fn();
global.fetch = mockFetch;

vi.mock("@/lib/sanity", () => ({
  fetchSanity: vi.fn().mockResolvedValue([]),
}));

describe("articles.ts", () => {
  const testCategorySlug = "el-placer-de-leer";
  const testSlug = "test-article";

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  describe("getAllArticles", () => {
    it("returns empty array when no articles found in test environment", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ files: [] }),
      } as Response);

      const result = await getAllArticles();

      expect(result).toEqual([]);
    });
  });

  describe("getArticlesByCategory", () => {
    it("returns empty array when no articles found in test environment", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ files: [] }),
      } as Response);

      const result = await getArticlesByCategory(testCategorySlug);

      expect(result).toEqual([]);
    });
  });

  describe("getArticleBySlug", () => {
    it("returns null when article not found", async () => {
      mockFetch.mockResolvedValue({
        ok: false,
      } as Response);

      const result = await getArticleBySlug("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getFeaturedArticles", () => {
    it("returns empty array when no featured articles found in test environment", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ files: [] }),
      } as Response);

      const result = await getFeaturedArticles();

      expect(result).toEqual([]);
    });
  });

  describe("getRelatedArticles", () => {
    it("returns empty array when no related articles found in test environment", async () => {
      const mockArticle = {
        slug: testSlug,
        title: "Test Article",
        excerpt: "This is a test excerpt",
        content: "<p>Test content</p>",
        author: {
          name: "Test Author",
          handle: "@testauthor",
          avatar: "bg-brand-gray",
        },
        category: "El placer de leer",
        categorySlug: testCategorySlug,
        tags: ["literatura", "ensayo"],
        featured: false,
        publishedAt: "2024-01-15T10:00:00Z",
        readTime: "5 min",
        likes: 42,
        comments: 5,
        type: "standard" as const,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ files: [] }),
      } as Response);

      const result = await getRelatedArticles(mockArticle);

      expect(result).toEqual([]);
    });
  });

  describe("getCategoriesWithCounts", () => {
    it("returns categories with article counts", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ files: [] }),
      } as Response);

      const result = await getCategoriesWithCounts();

      expect(result).toHaveLength(8); // CATEGORIES.length
      expect(result[0]).toHaveProperty("count");
      expect(result[0].count).toBe(0); // No files in test environment
    });
  });

  describe("formatPlainTextToHtml", () => {
    it("converts plain text to HTML paragraphs", () => {
      const input = "First paragraph.\n\nSecond paragraph.";
      const expected = "<p>First paragraph.</p>\n\n<p>Second paragraph.</p>";

      const result = formatPlainTextToHtml(input);

      expect(result).toBe(expected);
    });

    it("handles single line breaks", () => {
      const input = "Line 1.\nLine 2.";
      const expected = "<p>Line 1.<br />Line 2.</p>";

      const result = formatPlainTextToHtml(input);

      expect(result).toBe(expected);
    });

    it("returns empty string for empty input", () => {
      const result = formatPlainTextToHtml("");

      expect(result).toBe("");
    });
  });
});
