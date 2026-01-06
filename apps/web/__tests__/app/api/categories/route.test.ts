import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/categories/route";
import * as articlesLib from "@/lib/articles";

vi.mock("@/lib/articles");

const mockedCategories = [
  {
    name: "El placer de leer",
    slug: "el-placer-de-leer",
    description: "Reflexiones y ensayos sobre la experiencia de la lectura",
  },
  {
    name: "A pie de página",
    slug: "a-pie-de-pagina",
    description: "Viajes, literatura y cultura",
  },
  {
    name: "Crítica",
    slug: "critica",
    description: "Análisis crítico de obras literarias",
  },
  {
    name: "Reseñas",
    slug: "resenas",
    description: "Reseñas de libros y publicaciones",
  },
  {
    name: "Entrevistas",
    slug: "entrevistas",
    description: "Conversaciones con autores y figuras del mundo literario",
  },
  {
    name: "Columnas",
    slug: "columnas",
    description: "Opinión y columnas de nuestros colaboradores",
  },
];

function createMockRequest(url: string): Request {
  return new Request(`http://localhost:3000${url}`);
}

describe("GET /api/categories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(articlesLib, "CATEGORIES", "get").mockReturnValue(
      mockedCategories,
    );
  });

  it("returns CATEGORIES array", async () => {
    const request = createMockRequest("/api/categories");
    const response = await GET(request);
    const body = await response.json();

    expect(response.ok).toBe(true);
    expect(body.success).toBe(true);
    expect(body.data).toEqual(mockedCategories);
  });

  it("each category has name, slug, description", async () => {
    const request = createMockRequest("/api/categories");
    const response = await GET(request);
    const body = await response.json();

    for (const category of body.data) {
      expect(category).toHaveProperty("name");
      expect(category).toHaveProperty("slug");
      expect(category).toHaveProperty("description");
      expect(typeof category.name).toBe("string");
      expect(typeof category.slug).toBe("string");
      expect(typeof category.description).toBe("string");
    }
  });

  it("returns all 6 categories", async () => {
    const request = createMockRequest("/api/categories");
    const response = await GET(request);
    const body = await response.json();

    expect(body.data.length).toBe(6);
  });

  it("response format matches expected structure", async () => {
    const request = createMockRequest("/api/categories");
    const response = await GET(request);
    const body = await response.json();

    expect(body).toHaveProperty("success");
    expect(body).toHaveProperty("data");
    expect(body.success).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);

    const expectedCategory = {
      name: "El placer de leer",
      slug: "el-placer-de-leer",
      description: "Reflexiones y ensayos sobre la experiencia de la lectura",
    };
    expect(body.data[0]).toEqual(expectedCategory);
  });
});
