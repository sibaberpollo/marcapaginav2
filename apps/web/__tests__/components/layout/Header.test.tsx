import { render, screen, act } from "@testing-library/react";
import { usePathname } from "next/navigation";
import Header from "@/components/layout/Header";

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
}));

describe("Header", () => {
  let scrollYValue = 0;
  let scrollXValue = 0;

  beforeEach(() => {
    vi.clearAllMocks();
    scrollYValue = 0;
    scrollXValue = 0;
    (window.scrollTo as ReturnType<typeof vi.fn>) = vi.fn();
    Object.defineProperty(window, "scrollY", {
      get: () => scrollYValue,
      configurable: true,
    });
    Object.defineProperty(window, "scrollX", {
      get: () => scrollXValue,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("Renders header banner with role=banner", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  test("Renders logo with alt=Marcapágina", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByAltText("Marcapágina")).toBeInTheDocument();
  });

  test("Renders ThemeToggle component", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByRole("checkbox", { hidden: true })).toBeInTheDocument();
  });

  test("Renders ad banner placeholder (INS element)", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    const { container } = render(<Header />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const insElement = container.querySelector("ins");
    expect(insElement).toBeInTheDocument();
  });

  test("Header is hidden when usePathname returns /relato", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue(
      "/relato/test-story",
    );
    const { container } = render(<Header />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const header = container.querySelector("header");
    expect(header).not.toBeInTheDocument();
  });

  test("Header is hidden when usePathname returns /transtextos", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/transtextos");
    const { container } = render(<Header />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const header = container.querySelector("header");
    expect(header).not.toBeInTheDocument();
  });

  test("Header is visible when usePathname returns /", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  test("Scroll event listener added on mount", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    render(<Header />);
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
      { passive: true },
    );
  });

  test("Scroll event listener removed on unmount", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = render(<Header />);
    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "scroll",
      expect.any(Function),
    );
  });

  test("window.scrollY > 100 triggers hidden state (adds -translate-y-full class)", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    const { container } = render(<Header />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    act(() => {
      scrollYValue = 100;
      scrollXValue = 0;
      window.dispatchEvent(new Event("scroll"));
      scrollYValue = 150;
      scrollXValue = 0;
      window.dispatchEvent(new Event("scroll"));
    });
    const adBanner = container.querySelector(".fixed");
    expect(adBanner?.classList.contains("-translate-y-full")).toBe(true);
  });

  test("Scrolling up reveals header (removes -translate-y-full class)", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    const { container } = render(<Header />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    act(() => {
      scrollYValue = 150;
      scrollXValue = 0;
      window.dispatchEvent(new Event("scroll"));
      scrollYValue = 50;
      window.dispatchEvent(new Event("scroll"));
    });
    const adBanner = container.querySelector(".fixed");
    expect(adBanner?.classList.contains("-translate-y-full")).toBe(false);
  });

  test("adRef.current triggers adsbygoogle.push when not null", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    (window as any).adsbygoogle = undefined;
    const { container } = render(<Header />, {
      container: document.body.appendChild(document.createElement("div")),
    });
    const insElement = container.querySelector("ins");
    expect(insElement).toBeInTheDocument();
  });

  test("adRef.current does not throw when adRef is null", () => {
    (usePathname as ReturnType<typeof vi.fn>).mockReturnValue("/");
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const renderFn = () => {
      render(<Header />, {
        container: document.body.appendChild(document.createElement("div")),
      });
    };
    expect(renderFn).not.toThrow();
    consoleErrorSpy.mockRestore();
  });
});
