import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "error" | "ghost";
  size?: "sm" | "md" | "lg";
  outline?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  primary: "badge-primary",
  secondary: "badge-secondary",
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  ghost: "badge-ghost",
};

const sizeClasses: Record<NonNullable<BadgeProps["size"]>, string> = {
  sm: "badge-sm",
  md: "badge-md",
  lg: "badge-lg",
};

export default function Badge({
  variant = "primary",
  size = "md",
  outline = false,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          "badge",
          variantClasses[variant],
          sizeClasses[size],
          outline && "badge-outline",
          className,
        ),
      )}
      {...props}
    >
      {children}
    </span>
  );
}
