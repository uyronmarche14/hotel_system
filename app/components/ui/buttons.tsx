import { BaseProps, ButtonVariant } from "@/app/types/ui";
import { cn } from "@/app/lib/utils";

interface ButtonProps extends BaseProps {
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    " hover:bg-[var(--primary-hover)] text-white border-1 border-white rounded-[4px] w-[140px] h-[40px] flex items-center justify-center text-center font-bold",
  secondary:
    "bg-white text-black border-1 border-black rounded-[4px] w-[140px] h-[40px] flex items-center justify-center text-center font-bold hover:opacity-90",
  danger: "bg-red-600 hover:bg-red-700 text-white",
  success: "bg-green-600 hover:bg-green-700 text-white",
  warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
  info: "bg-cyan-600 hover:bg-cyan-700 text-white",
};

const sizeStyles = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export default function Button({
  label,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  fullWidth,
  disabled,
  className,
  type = "button",
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={cn(
        "rounded-lg font-medium transition-colors duration-200",
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <span className="flex items-center justify-center gap-2">
        {icon}
        {label}
      </span>
    </button>
  );
}
