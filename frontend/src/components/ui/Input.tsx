import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-sans text-sm text-ink/70">
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className={`
            font-sans text-base text-ink bg-transparent
            border-0 border-b py-2
            focus:outline-none
            transition-colors duration-150
            ${error ? "border-stamp" : "border-rule focus:border-stamp"}
            ${className}
          `}
          {...props}
        />
        {error && (
          <p className="font-sans text-sm text-stamp-deep" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;