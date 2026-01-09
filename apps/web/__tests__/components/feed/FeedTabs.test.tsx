import { render, screen, fireEvent } from "@testing-library/react";
import FeedTabs from "@/components/feed/FeedTabs";

describe("FeedTabs", () => {
  it('Renders tab button for ["TODO"]', () => {
    render(<FeedTabs />);
    expect(screen.getByRole("button", { name: "TODO" })).toBeInTheDocument();
  });

  it('First tab "TODO" starts with aria-checked="true"', () => {
    render(<FeedTabs />);
    const todoTab = screen.getByRole("button", { name: "TODO" });
    expect(todoTab).toHaveAttribute("aria-checked", "true");
  });

  it("Only one tab exists", () => {
    render(<FeedTabs />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
  });

  it("Single tab has active styling by default", () => {
    render(<FeedTabs />);
    const todoTab = screen.getByRole("button", { name: "TODO" });
    expect(todoTab.className).toContain("bg-black");
    expect(todoTab.className).toContain("text-white");
  });

  it("Single tab is clickable without errors", () => {
    render(<FeedTabs />);
    const todoTab = screen.getByRole("button", { name: "TODO" });
    // Clicking should not throw
    fireEvent.click(todoTab);
    expect(todoTab).toHaveAttribute("aria-checked", "true");
  });
});
