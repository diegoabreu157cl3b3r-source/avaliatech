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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/80 p-4 backdrop-blur-md sm:items-center">
      <div className={`max-h-[90vh] w-full ${maxWidthClass} overflow-y-auto rounded-3xl border border-navy-700 bg-navy-900 p-6 shadow-2xl transition text-slate-100`}>
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-100">{title}</h2>
            {description && (
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            )}
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onClose} aria-label="Fechar modal">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

