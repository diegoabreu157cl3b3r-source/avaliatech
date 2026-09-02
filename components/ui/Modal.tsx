"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ModalProps {
  title: string;
  description?: string;
  size?: "md" | "lg" | "xl";
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, description, size = "md", isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  const maxWidthClass =
    size === "xl"
      ? "max-w-4xl"
      : size === "lg"
      ? "max-w-2xl"
      : "max-w-xl";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-4 backdrop-blur-sm sm:items-center">
      <div className={`max-h-[90vh] w-full ${maxWidthClass} overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl transition dark:border-slate-800 dark:bg-slate-900`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">{title}</h2>
            {description && (
              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>
            )}
          </div>
          <Button type="button" variant="ghost" className="h-9 w-9 p-0" onClick={onClose} aria-label="Fechar modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

