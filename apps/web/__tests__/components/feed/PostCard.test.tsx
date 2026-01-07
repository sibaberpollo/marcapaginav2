import { render, screen } from "@testing-library/react";
import PostCard from "@/components/feed/PostCard";

const defaultProps = {
  title: "Test Title",
  excerpt: "This is a test excerpt that should be truncated after two lines.",
  author: "Juan Pérez",
  authorColor: "bg-purple-200",
  timeAgo: "hace 2h",
  tags: ["Literatura", "Cultura"],
  likes: 42,
  comments: 15,
  readTime: "5 min",
};

describe("PostCard", () => {
  it("Renders title text in h3 element", () => {
    render(<PostCard {...defaultProps} />);
    expect(
      screen.getByRole("heading", { level: 3, name: "Test Title" }),
    ).toBeInTheDocument();
  });

  it("Renders excerpt in p element with line-clamp-2", () => {
    render(<PostCard {...defaultProps} />);
    const excerpt = screen.getByText(
      "This is a test excerpt that should be truncated after two lines.",
    );
    expect(excerpt.tagName).toBe("P");
    expect(excerpt.className).toContain("line-clamp-2");
  });

  it("Renders author name with correct styling", () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText("Juan Pérez")).toBeInTheDocument();
  });

  it("Renders authorColor circle (div with bg-purple-200)", () => {
    render(<PostCard {...defaultProps} />);
    const colorCircle = screen.getByTestId("author-color-circle");
    expect(colorCircle.className).toContain("bg-purple-200");
  });

  it('Renders timeAgo text (e.g., "hace 2h")', () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText("hace 2h")).toBeInTheDocument();
  });

  it("Renders all tags as links with # prefix", () => {
    render(<PostCard {...defaultProps} />);
    expect(
      screen.getByRole("link", { name: "#Literatura" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "#Cultura" })).toBeInTheDocument();
  });

  it("Renders 3 action buttons (likes, comments, save)", () => {
    render(<PostCard {...defaultProps} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });

  it("Renders like count, comment count, readTime text", () => {
    render(<PostCard {...defaultProps} />);
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("5 min")).toBeInTheDocument();
  });

  it("Hover state on title (hover:text-brand-yellow)", () => {
    render(<PostCard {...defaultProps} />);
    const titleLink = screen
      .getByRole("heading", { level: 3 })
      .querySelector("a");
    expect(titleLink?.className).toContain("hover:text-brand-yellow");
  });

  it("Hover state on tags (hover:bg-surface-2)", () => {
    render(<PostCard {...defaultProps} />);
    const tagLink = screen.getByRole("link", { name: "#Literatura" });
    expect(tagLink.className).toContain("hover:bg-surface-2");
  });

  it("PostCard has border-surface-2 and hover:border-brand-gray/30", () => {
    render(<PostCard {...defaultProps} />);
    const article = screen.getByRole("article");
    expect(article.className).toContain("border-surface-2");
    expect(article.className).toContain("hover:border-brand-gray/30");
  });

  it("Title is wrapped in Link component", () => {
    render(<PostCard {...defaultProps} />);
    const titleLink = screen
      .getByRole("heading", { level: 3 })
      .querySelector("a");
    expect(titleLink).toHaveAttribute("href", "#");
  });

  it("Category tag is clickable", () => {
    render(<PostCard {...defaultProps} />);
    const tagLink = screen.getByRole("link", { name: "#Literatura" });
    expect(tagLink).toHaveAttribute("href", "/tag/Literatura");
  });
});
