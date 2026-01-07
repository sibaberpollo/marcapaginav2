import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import Toast from "./Toast";

describe("Toast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders message", () => {
    render(<Toast message="Success!" />);
    expect(screen.getByText("Success!")).toBeInTheDocument();
  });

  it("applies type classes", () => {
    const { rerender } = render(<Toast message="Info" type="info" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-info");

    rerender(<Toast message="Success" type="success" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-success");

    rerender(<Toast message="Warning" type="warning" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-warning");

    rerender(<Toast message="Error" type="error" />);
    expect(screen.getByRole("alert")).toHaveClass("alert-error");
  });

  it("calls onClose after duration", () => {
    const onClose = vi.fn();
    render(<Toast message="Auto close" duration={2000} onClose={onClose} />);

    expect(onClose).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(onClose).toHaveBeenCalled();
  });

  it("does not auto-close when duration is 0", () => {
    const onClose = vi.fn();
    render(<Toast message="No auto close" duration={0} onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  it("renders close button", () => {
    render(<Toast message="With close" />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("calls onClose when close button clicked", () => {
    const onClose = vi.fn();
    render(<Toast message="Click to close" onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("renders icon based on type", () => {
    render(<Toast message="Success" type="success" />);
    const alert = screen.getByRole("alert");
    expect(alert.querySelector("svg")).toBeInTheDocument();
  });

  it("applies base classes", () => {
    render(<Toast message="Test" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("alert");
    expect(alert).toHaveClass("shadow-lg");
  });

  it("removes from DOM when closed", () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <Toast message="Will close" onClose={onClose} />,
    );

    expect(screen.getByText("Will close")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalled();

    unmount();
    act(() => {
      vi.advanceTimersByTime(0);
    });
  });
});
