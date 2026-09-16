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
  primary: "bg-gold-500 text-white dark:text-navy-950 font-bold hover:bg-gold-400 focus:ring-gold-500/30 shadow-sm active:scale-[0.98]",
  secondary: "bg-navy-850 text-slate-100 border border-navy-700 hover:bg-navy-800 hover:border-navy-600 focus:ring-gold-500/20 active:scale-[0.98]",
  danger: "bg-rose-600/90 text-white border border-rose-500/30 hover:bg-rose-500 focus:ring-rose-500/30 active:scale-[0.98]",
  ghost: "bg-transparent text-slate-400 border border-transparent hover:bg-navy-850 hover:text-slate-100 hover:border-navy-700 focus:ring-gold-500/20 active:scale-[0.98]"
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-xl",
  md: "px-4 py-2 text-sm rounded-xl",
  lg: "px-5 py-2.5 text-sm sm:text-base rounded-2xl",
  icon: "h-8 w-8 p-0 rounded-xl shrink-0"
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
      className={`inline-flex items-center justify-center font-semibold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${sizeClass} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className={`animate-spin ${isIcon ? "h-3.5 w-3.5" : "h-3.5 w-3.5 mr-2"}`} />
      ) : null}
      {isLoading && isIcon ? null : (isLoading && typeof children === "string" ? "Carregando..." : children)}
    </button>
  );
}
