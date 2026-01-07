import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "./Input";

describe("Input", () => {
  it("renders without label", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("applies error state", () => {
    render(<Input error="Required field" />);
    expect(screen.getByRole("textbox")).toHaveClass("input-error");
    expect(screen.getByText("Required field")).toBeInTheDocument();
  });

  it("renders helper text", () => {
    render(<Input helperText="Enter your email" />);
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("does not show helper text when error is present", () => {
    render(<Input error="Error" helperText="Helper text" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.queryByText("Helper text")).not.toBeInTheDocument();
  });

  it("handles disabled state", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("handles onChange", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Input onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "hello");
    expect(onChange).toHaveBeenCalled();
  });

  it("applies base classes", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveClass("input");
    expect(screen.getByRole("textbox")).toHaveClass("input-bordered");
    expect(screen.getByRole("textbox")).toHaveClass("w-full");
  });

  it("sets aria-invalid when error present", () => {
    render(<Input error="Error" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});
