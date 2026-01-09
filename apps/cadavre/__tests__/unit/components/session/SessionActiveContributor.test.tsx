/**
 * Unit tests for SessionActiveContributor component
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SessionActiveContributor } from "@/components/session/SessionActiveContributor";
import { mockSessionState } from "../../../fixtures";

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

// Mock Header component
vi.mock("@/components/layout/Header", () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

// Mock fetch for API calls
global.fetch = vi.fn();

// Mock window methods
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe("SessionActiveContributor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Component Rendering", () => {
    it("renders header component", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByTestId("header")).toBeInTheDocument();
    });

    it("shows '¡Es tu turno!' when isMyTurn is true", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={true}
          myPosition={1}
        />,
      );

      expect(screen.getByText("¡Es tu turno!")).toBeInTheDocument();
    });

    it("shows 'Esperando tu turno' when isMyTurn is false", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText("Esperando tu turno")).toBeInTheDocument();
    });

    it("displays session theme when present", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText("A Mysterious Journey")).toBeInTheDocument();
    });

    it("shows progress information", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText(/Progreso:/)).toBeInTheDocument();
      expect(screen.getByText(/segmentos/)).toBeInTheDocument();
    });
  });

  describe("Progress Information", () => {
    it("shows progress information", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText(/Progreso:/)).toBeInTheDocument();
    });

    it("shows remaining contributors count", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText(/restantes/)).toBeInTheDocument();
    });
  });

  describe("Progress Information", () => {
    it("shows progress information", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText(/Progreso:/)).toBeInTheDocument();
    });

    it("shows remaining contributors count", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText(/restantes/)).toBeInTheDocument();
    });

    it("shows position indicator when not user's turn", () => {
      render(
        <SessionActiveContributor
          sessionState={mockSessionState}
          isMyTurn={false}
          myPosition={1}
        />,
      );

      expect(screen.getByText("Tu posición")).toBeInTheDocument();
    });
  });
});
