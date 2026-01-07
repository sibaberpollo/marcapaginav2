import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    const { rerender } = render(<Badge variant="primary">Primary</Badge>);
    expect(screen.getByText("Primary")).toHaveClass("badge-primary");

    rerender(<Badge variant="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary")).toHaveClass("badge-secondary");

    rerender(<Badge variant="success">Success</Badge>);
    expect(screen.getByText("Success")).toHaveClass("badge-success");

    rerender(<Badge variant="warning">Warning</Badge>);
    expect(screen.getByText("Warning")).toHaveClass("badge-warning");

    rerender(<Badge variant="error">Error</Badge>);
    expect(screen.getByText("Error")).toHaveClass("badge-error");

    rerender(<Badge variant="ghost">Ghost</Badge>);
    expect(screen.getByText("Ghost")).toHaveClass("badge-ghost");
  });

  it("applies size classes", () => {
    const { rerender } = render(<Badge size="sm">Small</Badge>);
    expect(screen.getByText("Small")).toHaveClass("badge-sm");

    rerender(<Badge size="md">Medium</Badge>);
    expect(screen.getByText("Medium")).toHaveClass("badge-md");

    rerender(<Badge size="lg">Large</Badge>);
    expect(screen.getByText("Large")).toHaveClass("badge-lg");
  });

  it("applies outline class", () => {
    render(<Badge outline>Outline</Badge>);
    expect(screen.getByText("Outline")).toHaveClass("badge-outline");
  });

  it("applies base classes", () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText("Badge")).toHaveClass("badge");
  });

  it("applies custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom-class");
  });
});
