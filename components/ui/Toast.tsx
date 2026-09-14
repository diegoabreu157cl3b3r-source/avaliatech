"use client";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
}

export function Toast({ message, type = "info" }: ToastProps) {
  const styles = {
    success: "border-emerald-500/40 bg-navy-900 text-emerald-400 shadow-emerald-950/40",
    error: "border-rose-500/40 bg-navy-900 text-rose-400 shadow-rose-950/40",
    info: "border-gold-500/40 bg-navy-900 text-gold-400 shadow-gold-950/40"
  };

  return (
    <div className={`fixed right-4 top-4 z-[60] max-w-sm rounded-2xl border px-4 py-3 text-sm font-bold shadow-2xl backdrop-blur-md transition-all animate-in fade-in slide-in-from-top-3 ${styles[type]}`}>
      {message}
    </div>
  );
}
