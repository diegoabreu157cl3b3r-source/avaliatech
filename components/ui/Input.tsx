import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input className={`field ${className}`} {...props} />
      {error && <span className="mt-1 block text-xs font-semibold text-rose-400">{error}</span>}
    </label>
  );
}
