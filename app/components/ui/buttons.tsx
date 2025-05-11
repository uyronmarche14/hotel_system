import { BaseProps, ButtonVariant, ButtonSize } from "@/app/types/ui";
import { cn } from "@/app/lib/utils";
import { forwardRef } from "react";

export interface ButtonProps extends Omit<BaseProps, 'size'> {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[#1C3F32] hover:bg-[#15302a] text-white border border-transparent",
  secondary: "bg-white text-[#1C3F32] border border-[#1C3F32] hover:bg-gray-100",
  danger: "bg-red-600 hover:bg-red-700 text-white border border-transparent",
  success: "bg-green-600 hover:bg-green-700 text-white border border-transparent",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white border border-transparent",
  info: "bg-cyan-600 hover:bg-cyan-700 text-white border border-transparent",
  ghost: "bg-transparent hover:bg-gray-100 text-[#1C3F32]",
  link: "bg-transparent text-[#1C3F32] hover:underline p-0 h-auto",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
  xl: "px-8 py-4 text-xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      onClick,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      fullWidth,
      disabled,
      className,
      type = "button",
      isLoading,
      ...rest
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled || isLoading}
        type={type}
        className={cn(
          "rounded-md font-medium transition-all duration-200",
          variantStyles[variant],
          sizeStyles[size],
          fullWidth ? "w-full" : "",
          (disabled || isLoading) ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          variant !== "link" && "flex items-center justify-center",
          className
        )}
        {...rest}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {icon && iconPosition === "left" && icon}
            {label}
            {icon && iconPosition === "right" && icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
