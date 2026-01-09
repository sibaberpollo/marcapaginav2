import { NextResponse } from "next/server";
import { getAllArticles, getFeaturedArticles } from "@/lib/articles";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") || "50", 10);

  try {
    let articles;

    if (featured === "true") {
      articles = await getFeaturedArticles(limit);
    } else if (category) {
      articles = await getAllArticles();
      articles = articles.filter(
        (article) => article.categorySlug === category,
      );
      articles = articles.slice(0, limit);
    } else {
      articles = await getAllArticles();
      articles = articles.slice(0, limit);
    }

    return NextResponse.json({
      success: true,
      data: articles,
      count: articles.length,
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 },
    );
  }
}
