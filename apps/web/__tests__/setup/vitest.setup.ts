import "@testing-library/jest-dom";
import { vi, beforeAll, afterEach, afterAll } from "vitest";
import { server } from "../setup/msw/server";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: vi.fn(),
  useSearchParams: vi.fn(() => new URLSearchParams()),
  useParams: vi.fn(() => ({})),
}));

// Set up MSW server for API mocking
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(() => "dark"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Type the localStorage mock for TypeScript
declare global {
  interface Window {
    localStorage: {
      getItem: ReturnType<typeof vi.fn>;
      setItem: ReturnType<typeof vi.fn>;
      removeItem: ReturnType<typeof vi.fn>;
      clear: ReturnType<typeof vi.fn>;
    };
  }
}

window.matchMedia = vi.fn((query: string) => ({
  matches: query === "(prefers-color-scheme: dark)",
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

window.scrollTo = vi.fn();

const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    args[0].includes("Warning: Extra attributes from the server")
  ) {
    return;
  }
  originalWarn(...args);
};
