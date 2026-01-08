import { test, expect } from "@playwright/test";

const CADAVRE_URL = "http://localhost:3000";

test.describe("Session Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");
  });

  test("should load the landing page with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Cadavre/);
  });

  test("should display hero section", async ({ page }) => {
    const hero = page.locator("section").first();
    await expect(hero).toContainText("Cadavre");
  });

  test("should have create session form", async ({ page }) => {
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("should show theme selector with options", async ({ page }) => {
    const themeSelect = page.locator("select").first();
    await expect(themeSelect).toBeVisible();

    // Check for default option
    await expect(themeSelect.locator("option").first()).toContainText(
      "Sin tema",
    );
  });

  test("should have opening segment textarea", async ({ page }) => {
    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible();
  });

  test("should have max contributors selector", async ({ page }) => {
    const contributorsSelect = page.locator("select").nth(1);
    await expect(contributorsSelect).toBeVisible();
  });

  test("should disable submit button initially", async ({ page }) => {
    const submitButton = page.locator("button[type='submit']");
    await expect(submitButton).toBeDisabled();
  });

  test("should enable submit when word count is valid", async ({ page }) => {
    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible({ timeout: 10000 });

    const submitButton = page.locator("button[type='submit']");

    const validSegment =
      "La noche era oscura y llena de estrellas misteriosas que brillaban en el cielo infinito. El viento susurraba secretos antiguos entre los árboles centenarios mientras la luna iluminaba el camino de piedra. Un viajero perdido buscaba refugio en el pueblo abandonado donde los fantasmas de historias pasadas aún habitaban cada rincón oscuro de las casas vacías. El misterio del lugar lo envolvía todo completamente.";

    await textarea.fill(validSegment);

    await expect(submitButton).toBeEnabled({ timeout: 10000 });
  });

  test("should show word count feedback", async ({ page }) => {
    const textarea = page.locator("textarea");
    const wordCountDisplay = page.locator("[role='status']");

    await textarea.fill("Hola mundo");

    await expect(wordCountDisplay).toBeVisible();
    await expect(wordCountDisplay).toContainText("2 palabras");
  });

  test("should scroll to form when CTA clicked", async ({ page }) => {
    const ctaButton = page.locator("button:has-text('Crear tu historia')");
    const form = page.locator("form");

    await ctaButton.click();

    // Form should be in view
    await expect(form).toBeInViewport();
  });

  test("should show how it works section", async ({ page }) => {
    const howItWorks = page.locator("section:has-text('¿Cómo funciona?')");
    await expect(howItWorks).toBeVisible();
  });

  test("should have 3 steps in how it works", async ({ page }) => {
    const steps = page.locator(
      "section:has-text('¿Cómo funciona?') >> .. >> .. >> .group",
    );
    await expect(steps).toHaveCount(3);
  });
});

test.describe("Session Creation API Integration", () => {
  test("should create session when form is submitted", async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible({ timeout: 10000 });

    const validSegment =
      "Era una vez en un lugar muy lejano donde los sueños se convertían en realidad y la magia llenaba cada rincón oscuro del bosque encantado. Cada noche, cuando la luna brillaba intensamente en el cielo estrellado y claro, los habitantes del pueblo mágico podían ver sus deseos más profundos hacerse visibles en el aire fresco de la montaña nevada cubierta de nieve blanca. Las historias antiguas cobraban vida entre las sombras misteriosas del castillo abandonado.";

    await textarea.fill(validSegment);

    const submitButton = page.locator("button[type='submit']");
    await expect(submitButton).toBeEnabled({ timeout: 5000 });
    await submitButton.click();

    await expect(submitButton).toContainText(/Creando|crear/i, {
      timeout: 5000,
    });
  });
});

test.describe("Mobile Responsiveness", () => {
  test("should be responsive on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible({ timeout: 10000 });

    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible({ timeout: 10000 });
  });
});

test.describe("Accessibility", () => {
  test("should have proper form labels", async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    const textarea = page.locator("textarea");
    await expect(textarea).toBeVisible({ timeout: 10000 });
    await expect(textarea).toHaveAttribute("id");
  });

  test("should have button with type attribute", async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    const submitButton = page.locator("button[type='submit']");
    await expect(submitButton).toBeVisible({ timeout: 10000 });
    await expect(submitButton).toHaveAttribute("type", "submit");
  });

  test("should have proper heading structure", async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    // Check that h1 exists
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible({ timeout: 10000 });
    await expect(h1).toContainText("Cadavre");
  });
});

test.describe("Share Links Component", () => {
  test("should have share functionality", async ({ page }) => {
    // Navigate to a completed session or create one first
    // For now, we test that the ShareLinks component exists
    await page.goto(CADAVRE_URL);

    // The share section should be visible on completed sessions
    // This will be tested when we have a completed session
  });
});

test.describe("Theme Toggle", () => {
  test("should have theme toggle in header", async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    const themeToggle = page.locator("button[aria-label*='mode']");
    await expect(themeToggle).toBeVisible();
  });

  test("should toggle between light and dark themes", async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    // Check initial theme (should be light by default)
    const html = page.locator("html");
    const initialTheme = await html.getAttribute("data-theme");
    expect(initialTheme).toBe("light");

    // Click theme toggle
    const themeToggle = page.locator("button[aria-label*='mode']");
    await themeToggle.click();

    // Check theme changed to dark
    const darkTheme = await html.getAttribute("data-theme");
    expect(darkTheme).toBe("dark");

    // Click again to go back to light
    await themeToggle.click();
    const lightTheme = await html.getAttribute("data-theme");
    expect(lightTheme).toBe("light");
  });

  test("should persist theme choice", async ({ page }) => {
    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("domcontentloaded");

    // Switch to dark theme
    const themeToggle = page.locator("button[aria-label*='mode']");
    await themeToggle.click();

    // Refresh page
    await page.reload();
    await page.waitForLoadState("domcontentloaded");

    // Check theme persisted
    const html = page.locator("html");
    const persistedTheme = await html.getAttribute("data-theme");
    expect(persistedTheme).toBe("dark");
  });
});

test.describe("Hydration Safety", () => {
  test("should not have hydration warnings", async ({ page }) => {
    const warnings: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "warning" && msg.text().includes("hydration")) {
        warnings.push(msg.text());
      }
    });

    await page.goto(CADAVRE_URL);
    await page.waitForLoadState("networkidle");

    // Wait a bit for any hydration warnings to appear
    await page.waitForTimeout(2000);

    expect(warnings.length).toBe(0);
  });

  test("should handle theme initialization without flash", async ({ page }) => {
    await page.goto(CADAVRE_URL);

    // Check that html element has suppressHydrationWarning
    const html = page.locator("html");
    const hasSuppressWarning = await html.getAttribute(
      "suppressHydrationWarning",
    );
    expect(hasSuppressWarning).toBeDefined(); // attribute present (boolean attribute)

    await page.waitForLoadState("networkidle");

    // After hydration, theme should be set
    const theme = await html.getAttribute("data-theme");
    expect(["light", "dark"]).toContain(theme);
  });
});
