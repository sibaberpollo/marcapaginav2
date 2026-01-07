import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Card from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>,
    );
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("applies base classes", () => {
    render(<Card>Content</Card>);
    const card = screen.getByText("Content").closest("div");
    expect(card).toHaveClass("card");
    expect(card).toHaveClass("bg-base-100");
    expect(card).toHaveClass("shadow-xl");
  });

  it("applies hoverable classes", () => {
    render(<Card hoverable>Hoverable</Card>);
    const card = screen.getByText("Hoverable").closest("div");
    expect(card).toHaveClass("hover:shadow-2xl");
    expect(card).toHaveClass("transition-shadow");
  });

  it("applies custom className", () => {
    render(<Card className="custom-class">Custom</Card>);
    const card = screen.getByText("Custom").closest("div");
    expect(card).toHaveClass("custom-class");
  });

  it("handles onClick", async () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    const card = screen.getByText("Clickable").closest("div");
    await fireEvent.click(card!);
    expect(onClick).toHaveBeenCalled();
  });

  it("handles keyboard activation (Enter)", async () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    const card = screen.getByText("Clickable").closest("div");
    await fireEvent.keyDown(card!, { key: "Enter" });
    expect(onClick).toHaveBeenCalled();
  });

  it("handles keyboard activation (Space)", async () => {
    const onClick = vi.fn();
    render(<Card onClick={onClick}>Clickable</Card>);
    const card = screen.getByText("Clickable").closest("div");
    await fireEvent.keyDown(card!, { key: " " });
    expect(onClick).toHaveBeenCalled();
  });

  it("has tabIndex when clickable", () => {
    render(<Card onClick={() => {}}>Clickable</Card>);
    const card = screen.getByText("Clickable").closest("div");
    expect(card).toHaveAttribute("tabIndex", "0");
  });

  it("does not have role when not clickable", () => {
    render(<Card>Not clickable</Card>);
    const card = screen.getByText("Not clickable").closest("div");
    expect(card).not.toHaveAttribute("role");
  });
});
