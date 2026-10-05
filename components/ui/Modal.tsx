"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ModalProps {
  title: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function Modal({ title, description, size = "md", isOpen, onClose, children }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // 1. Fechar ao pressionar tecla ESC
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    // 2. Travar o scroll da página enquanto o modal estiver aberto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass =
    size === "xl"
      ? "max-w-4xl"
      : size === "lg"
      ? "max-w-2xl"
      : size === "sm"
      ? "max-w-md"
      : "max-w-xl";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/80 p-4 backdrop-blur-md sm:items-center animate-in fade-in duration-200"
      onClick={(e) => {
        // Fechar se clicar fora do conteúdo (no backdrop)
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[90vh] w-full ${maxWidthClass} overflow-y-auto rounded-3xl border border-navy-700 bg-navy-900 p-6 shadow-2xl transition text-slate-100 animate-in zoom-in-95 duration-200`}
      >
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-navy-750 pb-3.5">
          <div>
            <h2 id="modal-title" className="text-xl font-black text-slate-100">
              {title}
            </h2>
            {description && (
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            )}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar modal"
            className="shrink-0 text-slate-400 hover:text-slate-100 hover:bg-navy-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
