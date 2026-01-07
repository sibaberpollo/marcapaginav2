import { render, fireEvent } from "@testing-library/react";
import ThemeToggle from "@/components/ui/ThemeToggle";

describe("ThemeToggle", () => {
  let scrollYValue = 0;
  let scrollXValue = 0;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: query === "(prefers-color-scheme: dark)",
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );
    Object.defineProperty(window, "scrollY", {
      get: () => scrollYValue,
      configurable: true,
    });
    Object.defineProperty(window, "scrollX", {
      get: () => scrollXValue,
      configurable: true,
    });
    vi.spyOn(document.documentElement, "setAttribute").mockImplementation(
      () => {},
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
    scrollYValue = 0;
    scrollXValue = 0;
  });

  test("Renders sun and moon icons in swap component", () => {
    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const swapComponent = container.querySelector(".swap");
    expect(swapComponent).toBeInTheDocument();
    const sunIcon = container.querySelector(".swap-off");
    const moonIcon = container.querySelector(".swap-on");
    expect(sunIcon).toBeInTheDocument();
    expect(moonIcon).toBeInTheDocument();
  });

  test("Checkbox starts unchecked when no localStorage or system prefers light", () => {
    localStorage.getItem.mockReturnValue(null);
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  test("Checkbox starts checked when localStorage has dark", () => {
    localStorage.getItem.mockReturnValue("dark");

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("Checkbox starts checked when system prefers dark", () => {
    localStorage.getItem.mockReturnValue(null);
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: true,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("Clicking checkbox toggles theme from light to dark", () => {
    localStorage.getItem.mockReturnValue("light");
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test("Clicking checkbox toggles theme from dark to light", () => {
    localStorage.getItem.mockReturnValue("dark");

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  test("localStorage.setItem called with theme and new value on toggle", () => {
    localStorage.getItem.mockReturnValue("light");
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(localStorage.setItem).toHaveBeenCalledWith("theme", "dark");
  });

  test("document.documentElement.setAttribute called with data-theme dark on dark toggle", () => {
    localStorage.getItem.mockReturnValue("light");
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "dark",
    );
  });

  test("document.documentElement.setAttribute called with data-theme light on light toggle", () => {
    localStorage.getItem.mockReturnValue("dark");

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    fireEvent.click(checkbox);
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      "data-theme",
      "light",
    );
  });

  test("useEffect reads localStorage.getItem(theme)", () => {
    localStorage.getItem.mockReturnValue("light");
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    expect(localStorage.getItem).toHaveBeenCalledWith("theme");
  });

  test("useEffect calls matchMedia(prefers-color-scheme: dark) for system preference", () => {
    localStorage.getItem.mockReturnValue(null);
    (window.matchMedia as ReturnType<typeof vi.fn>).mockImplementation(
      (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    );

    render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    expect(window.matchMedia).toHaveBeenCalledWith(
      "(prefers-color-scheme: dark)",
    );
  });

  test("No hydration mismatch (initial state uses localStorage in useEffect)", () => {
    localStorage.getItem.mockReturnValue("dark");

    const { container } = render(<ThemeToggle />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const checkbox = container.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });
});
