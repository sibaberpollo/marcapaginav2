import "@testing-library/jest-dom";
import { vi } from "vitest";

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

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(() => "dark"),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

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
