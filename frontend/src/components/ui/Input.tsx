import { forwardRef, useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, type, className = "", ...props }, ref) => {
    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const resolvedType = isPassword && showPassword ? "text" : type;

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="font-sans text-sm text-ink/70">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={resolvedType}
            className={`
              w-full font-sans text-base text-ink bg-transparent
              border-0 border-b py-2
              focus:outline-none
              transition-colors duration-150
              ${isPassword ? "pr-8" : ""}
              ${error ? "border-stamp" : "border-rule focus:border-stamp"}
              ${className}
            `}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition-colors"
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          )}
        </div>
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