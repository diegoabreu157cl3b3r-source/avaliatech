import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-200 dark:bg-brand-600 dark:hover:bg-brand-500 dark:focus:ring-brand-900/50",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-200 dark:bg-slate-100 dark:text-slate-950 dark:hover:bg-white dark:focus:ring-slate-700",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-200 dark:bg-red-600 dark:hover:bg-red-500 dark:focus:ring-red-900/50",
  ghost: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus:ring-slate-100 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700 dark:focus:ring-slate-800"
};

export function Button({ className = "", variant = "primary", isLoading, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-bold transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? "Carregando..." : children}
    </button>
  );
}

