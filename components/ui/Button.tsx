import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md" | "lg" | "icon";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-200 dark:bg-brand-600 dark:hover:bg-brand-500 dark:focus:ring-brand-900/50",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-200 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-900/50",
  ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:text-white dark:focus:ring-slate-800"
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-xl",
  md: "px-4 py-2.5 text-sm rounded-2xl",
  lg: "px-5 py-3 text-base rounded-2xl",
  icon: "h-9 w-9 p-0 rounded-xl shrink-0"
};

export function Button({
  className = "",
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const isIcon = size === "icon" || className.includes("h-8") || className.includes("h-9") || className.includes("h-10") && className.includes("w-");
  const sizeClass = sizes[size];

  return (
    <button
      className={`inline-flex items-center justify-center font-bold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClass} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`animate-spin ${isIcon ? "h-4 w-4" : "h-4 w-4 mr-2"}`} />
      ) : null}
      {isLoading && isIcon ? null : (isLoading && typeof children === "string" ? "Carregando..." : children)}
    </button>
  );
}

