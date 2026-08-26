"use client";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

export function Toast({ message, type = "info" }: ToastProps) {
  const styles = {
    success: "border-green-200 bg-green-50 text-green-800",
    error: "border-red-200 bg-red-50 text-red-800",
    info: "border-brand-100 bg-brand-50 text-brand-900"
  };

  return (
    <div className={`fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border px-4 py-3 text-sm font-semibold shadow-soft ${styles[type]}`}>
      {message}
    </div>
  );
}
