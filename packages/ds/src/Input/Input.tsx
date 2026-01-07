import { forwardRef, useId } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, type = "text", className, id, ...props },
    ref,
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;

    return (
      <div className="form-control w-full">
        {label && (
          <label htmlFor={inputId} className="label">
            <span className="label-text">{label}</span>
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : helperText ? helperId : undefined}
          className={twMerge(
            clsx(
              "input input-bordered w-full",
              error && "input-error",
              className,
            ),
          )}
          {...props}
        />
        {error && (
          <label id={errorId} className="label">
            <span className="label-text-alt text-error">{error}</span>
          </label>
        )}
        {helperText && !error && (
          <label id={helperId} className="label">
            <span className="label-text-alt">{helperText}</span>
          </label>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
