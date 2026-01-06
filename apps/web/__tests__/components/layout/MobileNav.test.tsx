import { render, screen } from "@testing-library/react";
import MobileNav from "@/components/layout/MobileNav";

describe("MobileNav", () => {
  it("Renders fixed bottom navigation on mobile (lg:hidden)", () => {
    render(<MobileNav />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("lg:hidden");
    expect(nav.className).toContain("fixed");
    expect(nav.className).toContain("bottom-0");
  });

  it("Renders all 4 nav items (Inicio, Artículos, Narrativa, Transtextos)", () => {
    render(<MobileNav />);
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Artículos")).toBeInTheDocument();
    expect(screen.getByText("Narrativa")).toBeInTheDocument();
    expect(screen.getByText("Horóscopo")).toBeInTheDocument();
  });

  it("Nav items have correct href attributes", () => {
    render(<MobileNav />);
    expect(screen.getByText("Inicio").closest("a")).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByText("Artículos").closest("a")).toHaveAttribute(
      "href",
      "/articulos",
    );
    expect(screen.getByText("Narrativa").closest("a")).toHaveAttribute(
      "href",
      "/transtextos",
    );
    expect(screen.getByText("Horóscopo").closest("a")).toHaveAttribute(
      "href",
      "/horoscopo",
    );
  });

  it("Custom 'T.' icon renders for Narrativa item", () => {
    render(<MobileNav />);
    const narrativaLink = screen.getByText("Narrativa").closest("a");
    const tIcon = narrativaLink?.querySelector(".rounded-full");
    expect(tIcon).toBeInTheDocument();
    expect(tIcon?.textContent).toContain("T.");
  });

  it("Navigation links use correct Next.js Link component", () => {
    render(<MobileNav />);
    const inicioLink = screen.getByText("Inicio").closest("a");
    expect(inicioLink?.tagName).toBe("A");
  });

  it("Hidden on desktop (lg:hidden)", () => {
    render(<MobileNav />);
    const nav = screen.getByRole("navigation");
    expect(nav.className).toContain("lg:hidden");
  });
});
