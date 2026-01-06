import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("Homepage loads with header, logo, and navigation", async ({ page }) => {
    await expect(page.locator("header")).toBeVisible();
    await expect(page.locator('img[alt="Marcapágina"]').first()).toBeVisible();
    await expect(page.locator("nav")).toBeVisible();
  });

  test("Theme toggle works - clicking switches to dark mode", async ({
    page,
  }) => {
    const themeToggle = page.locator(".theme-controller");
    await expect(themeToggle).toBeVisible();

    await themeToggle.click();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("Theme preference persists after page refresh", async ({ page }) => {
    const themeToggle = page.locator(".theme-controller");

    await themeToggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    await page.reload();

    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("Desktop navigation links are visible (1024px+)", async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    const desktopNav = page.locator("aside").locator("nav");
    await expect(desktopNav).toBeVisible();

    await expect(page.locator('a[href="/"]').first()).toBeVisible();
    await expect(page.locator('a[href="/articulos"]').first()).toBeVisible();
    await expect(page.locator('a[href="/transtextos"]').first()).toBeVisible();
    await expect(page.locator('a[href="/horoscopo"]').first()).toBeVisible();
  });

  test("Mobile navigation is hidden on desktop (lg:hidden)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1024, height: 768 });

    const mobileNav = page.locator("nav.fixed.bottom-0");
    await expect(mobileNav).not.toBeVisible();
  });

  test("Feed section renders with posts", async ({ page }) => {
    await expect(page.locator("main")).toBeVisible();

    await expect(
      page.locator("text=Manual de usuario para comenzar a leer"),
    ).toBeVisible();
    await expect(page.locator("text=La París de Hemingway")).toBeVisible();
  });

  test("Sidebars render with content", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    const leftSidebar = page.locator("aside").first();
    await expect(leftSidebar).toBeVisible();

    const rightSidebar = page.locator("aside").last();
    await expect(rightSidebar).toBeVisible();
  });

  test("Responsive layout - 3 columns on desktop, 1 on mobile", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    const main = page.locator("main").locator("..").locator("main");
    await expect(main.locator(".grid")).toHaveClass(
      /lg:grid-cols-\[240px_1fr_320px\]/,
    );

    await page.setViewportSize({ width: 375, height: 667 });
    const mobileMain = page.locator("main").first();
    await expect(mobileMain.locator(".grid")).not.toHaveClass(/lg:grid-cols-/);
  });
});
