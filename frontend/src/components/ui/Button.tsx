import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", isLoading, disabled, className = "", children, ...props }, ref) => {
    const base =
      "font-sans font-medium text-sm px-5 py-3 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-ink text-paper hover:bg-stamp-deep",
      ghost: "bg-transparent text-ink border border-rule hover:border-ink",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${className}`}
        {...props}
      >
        {isLoading ? "Working..." : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;