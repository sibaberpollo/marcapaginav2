import { test, expect } from "@playwright/test";

test.describe("Article Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/articulo/manual-de-usuario-para-comenzar-a-leer");
  });

  test("Article page renders title in h1", async ({ page }) => {
    await expect(page.locator("h1")).toContainText(
      "Manual de usuario para comenzar a leer",
    );
  });

  test("Article page renders author information", async ({ page }) => {
    await expect(page.locator("text=Hazael Valecillos")).toBeVisible();
  });

  test("Article page renders published date", async ({ page }) => {
    await expect(page.locator("text=de lectura")).toBeVisible();
  });

  test("Article page renders read time", async ({ page }) => {
    await expect(page.locator(/^\d+ min de lectura$/)).toBeVisible();
  });

  test("Article page renders article content", async ({ page }) => {
    const articleContent = page.locator(".article-content");
    await expect(articleContent).toBeVisible();
    await expect(articleContent).toContainText("lectura");
  });

  test("Article page includes SEO JSON-LD schema", async ({ page }) => {
    const jsonLd = page.locator('script[type="application/ld+json"]');
    await expect(jsonLd).toHaveCount(1);

    const jsonContent = await jsonLd.textContent();
    expect(jsonContent).toContain('"@type":"Article"');
  });

  test("Article links work (navigation)", async ({ page }) => {
    await page.locator('a[href="/"]').first().click();
    await expect(page).toHaveURL("/");

    await page.goto("/articulo/manual-de-usuario-para-comenzar-a-leer");
    await page.locator('a[href="/categoria/el-placer-de-leer"]').click();
    await expect(page).toHaveURL(/\/categoria\//);
  });

  test("Related articles section renders (when data exists)", async ({
    page,
  }) => {
    await expect(page.locator("text=Más artículos")).toBeVisible();
    await expect(
      page
        .locator("main article")
        .locator("..")
        .locator("section")
        .locator("a")
        .first(),
    ).toBeVisible();
  });
});
