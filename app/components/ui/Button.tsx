import { BaseProps, ButtonVariant, ButtonSize } from "@/app/types/ui";
import { cn } from "@/app/lib/utils";
import { forwardRef } from "react";
import { ImSpinner8 } from "react-icons/im";

export interface ButtonProps extends Omit<BaseProps, 'size'> {
  label?: string; // Optional if using children
  children?: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary: "bg-brand-green hover:bg-brand-green-hover text-white border border-transparent shadow-sm hover:shadow-md",
  secondary: "bg-white text-brand-green border border-brand-green hover:bg-gray-50",
  outline: "bg-transparent text-brand-green border border-brand-green hover:bg-brand-green/10",
  danger: "bg-red-600 hover:bg-red-700 text-white border border-transparent shadow-sm",
  success: "bg-green-600 hover:bg-green-700 text-white border border-transparent shadow-sm",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white border border-transparent shadow-sm",
  info: "bg-cyan-600 hover:bg-cyan-700 text-white border border-transparent shadow-sm",
  ghost: "bg-transparent hover:bg-gray-100 text-brand-green",
  link: "bg-transparent text-brand-green hover:underline p-0 h-auto font-normal",
};

const sizeStyles: Record<string, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm", // Crisp padding
  lg: "px-6 py-3 text-base",
  xl: "px-8 py-4 text-lg",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      children,
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
    // Determine content: children takes precedence, then label
    const content = children || label;
    
    return (
      <button
        ref={ref}
        onClick={onClick}
        disabled={disabled || isLoading}
        type={type}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-95 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-green/50 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none",
          variantStyles[variant] || variantStyles.primary,
          sizeStyles[size] || sizeStyles.md,
          fullWidth ? "w-full" : "",
          // Add subtle hover lift for primary/cards
          (variant === 'primary' || variant === 'secondary') && !disabled && !isLoading ? "hover:-translate-y-0.5" : "",
          className
        )}
        {...rest}
      >
        {isLoading ? (
          <>
            <ImSpinner8 className="animate-spin mr-2 h-4 w-4" />
            {content || "Loading..."}
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && <span className="mr-2">{icon}</span>}
            {content}
            {icon && iconPosition === "right" && <span className="ml-2">{icon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
