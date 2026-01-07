import { render, screen, fireEvent } from "@testing-library/react";
import FeedTabs from "@/components/feed/FeedTabs";

describe("FeedTabs", () => {
  it('Renders tab buttons for ["NARRATIVA", "CRÍTICA", "AGENDA"]', () => {
    const { container } = render(<FeedTabs />);
    console.log("FeedTabs component type:", FeedTabs);
    console.log("Rendered HTML:", container.innerHTML);
    console.log("All buttons:", screen.getAllByRole("button").map(b => b.textContent));
    expect(
      screen.getByRole("button", { name: "NARRATIVA" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "CRÍTICA" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "AGENDA" })).toBeInTheDocument();
  });

  it('First tab "NARRATIVA" starts with aria-checked="true"', () => {
    render(<FeedTabs />);
    const narrativaTab = screen.getByRole("button", { name: "NARRATIVA" });
    expect(narrativaTab).toHaveAttribute("aria-checked", "true");
  });

  it("Clicking tab changes activeTab state", () => {
    render(<FeedTabs />);
    const criticaTab = screen.getByRole("button", { name: "CRÍTICA" });
    fireEvent.click(criticaTab);
    expect(criticaTab).toHaveAttribute("aria-checked", "true");
  });

  it('Newly clicked tab gets aria-checked="true"', () => {
    render(<FeedTabs />);
    const agendaTab = screen.getByRole("button", { name: "AGENDA" });
    fireEvent.click(agendaTab);
    expect(agendaTab).toHaveAttribute("aria-checked", "true");
  });

  it('Previously active tab gets aria-checked="false"', () => {
    render(<FeedTabs />);
    const narrativaTab = screen.getByRole("button", { name: "NARRATIVA" });
    const criticaTab = screen.getByRole("button", { name: "CRÍTICA" });
    fireEvent.click(criticaTab);
    expect(narrativaTab).toHaveAttribute("aria-checked", "false");
  });

  it('Active tab has "bg-black text-white" styling', () => {
    render(<FeedTabs />);
    const narrativaTab = screen.getByRole("button", { name: "NARRATIVA" });
    expect(narrativaTab.className).toContain("bg-black");
    expect(narrativaTab.className).toContain("text-white");
  });

  it('Inactive tab has "text-brand-gray" styling', () => {
    render(<FeedTabs />);
    const criticaTab = screen.getByRole("button", { name: "CRÍTICA" });
    expect(criticaTab.className).toContain("text-brand-gray");
  });

  it("Tab count matches expected length", () => {
    render(<FeedTabs />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(3);
  });
});
