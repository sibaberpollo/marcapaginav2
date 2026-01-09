import { render, screen } from "@testing-library/react";
import FeaturedPost from "@/components/feed/FeaturedPost";

const defaultProps = {
  title: "Featured Article Title",
  excerpt: "This is a featured article excerpt",
  author: "María García",
  date: "15 mar 2024",
  readTime: "5 min",
  slug: "featured-article",
};

describe("FeaturedPost", () => {
  it("Renders with black background (bg-brand-black-static)", () => {
    render(<FeaturedPost {...defaultProps} />);
    const header = screen.getByText("DESTACADO").closest("div");
    expect(header?.className).toContain("bg-brand-black-static");
  });

  it("Renders badge with default 'DESTACADO' text", () => {
    render(<FeaturedPost {...defaultProps} />);
    expect(screen.getByText("DESTACADO")).toBeInTheDocument();
  });

  it("Badge accepts custom badge text prop", () => {
    render(<FeaturedPost {...defaultProps} badge="NUEVO" />);
    expect(screen.getByText("NUEVO")).toBeInTheDocument();
  });

  it("Title links to /articulo/{slug}", () => {
    render(<FeaturedPost {...defaultProps} />);
    const title = screen.getByRole("heading", { level: 2 });
    const link = title.querySelector("a");
    expect(link).toHaveAttribute("href", "/articulo/featured-article");
  });

  it("Href defaults to '#' when slug not provided", () => {
    render(<FeaturedPost {...defaultProps} slug={undefined} />);
    const title = screen.getByRole("heading", { level: 2 });
    const link = title.querySelector("a");
    expect(link).toHaveAttribute("href", "#");
  });

  it("Renders author info, date, and readTime", () => {
    render(<FeaturedPost {...defaultProps} />);
    expect(screen.getByText("María García")).toBeInTheDocument();
    expect(screen.getByText("15 mar 2024")).toBeInTheDocument();
    expect(screen.getByText("5 min")).toBeInTheDocument();
  });
});
