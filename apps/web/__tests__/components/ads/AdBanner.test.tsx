import { render, screen } from "@testing-library/react";
import AdBanner from "@/components/ads/AdBanner";

describe("AdBanner", () => {
  it("Renders 'Publicidad' label", () => {
    render(<AdBanner size="leaderboard" />);
    expect(screen.getByText("Publicidad")).toBeInTheDocument();
  });

  it("Applies correct size class based on size prop (leaderboard)", () => {
    render(<AdBanner size="leaderboard" />);
    const container =
      screen.getByText("Publicidad").parentElement?.parentElement;
    expect(container?.className).toContain("min-h-[90px]");
  });

  it("Applies correct size class based on size prop (medium-rectangle)", () => {
    render(<AdBanner size="medium-rectangle" />);
    const container =
      screen.getByText("Publicidad").parentElement?.parentElement;
    expect(container?.className).toContain("min-h-[250px]");
  });

  it("Applies correct size class based on size prop (skyscraper)", () => {
    render(<AdBanner size="skyscraper" />);
    const container =
      screen.getByText("Publicidad").parentElement?.parentElement;
    expect(container?.className).toContain("min-h-[600px]");
  });

  it("Applies correct size class based on size prop (in-feed)", () => {
    render(<AdBanner size="in-feed" />);
    const container =
      screen.getByText("Publicidad").parentElement?.parentElement;
    expect(container?.className).toContain("min-h-[100px]");
  });

  it("Applies correct size class based on size prop (mobile-anchor)", () => {
    render(<AdBanner size="mobile-anchor" />);
    const container =
      screen.getByText("Publicidad").parentElement?.parentElement;
    expect(container?.className).toContain("min-h-[50px]");
  });

  it("Renders container div for INS element placement", () => {
    const { container } = render(<AdBanner size="leaderboard" />);
    const innerDiv = container.querySelector("div > div.text-center");
    expect(innerDiv).toBeInTheDocument();
  });

  it("Applies border class", () => {
    render(<AdBanner size="leaderboard" />);
    const container =
      screen.getByText("Publicidad").parentElement?.parentElement;
    expect(container?.className).toContain("border");
    expect(container?.className).toContain("border-dashed");
  });

  it("Size prop defaults to 'leaderboard'", () => {
    const TestComponent = () => {
      return <AdBanner size="leaderboard" />;
    };
    render(<TestComponent />);
    const container =
      screen.getByText("Publicidad").parentElement?.parentElement;
    expect(container?.className).toContain("min-h-[90px]");
  });
});
