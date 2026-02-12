import { InputHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/app/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-auto")}>
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              "input-field transition-all duration-200 placeholder:text-gray-400 focus:ring-2 focus:ring-brand-green/20",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-gray-200 focus:border-brand-green",
              icon ? "pl-10" : "",
              className
            )}
            {...props}
          />
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 animate-fade-in">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
