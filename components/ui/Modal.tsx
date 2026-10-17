
"use client";

import { useEffect, useState } from "react";
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

interface VisibleViewport {
  height: number;
  top: number;
}

export function Modal({
  title,
  description,
  size = "md",
  isOpen,
  onClose,
  children,
}: ModalProps) {
  const [viewport, setViewport] = useState<VisibleViewport | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    function updateViewport() {
      const visualViewport = window.visualViewport;

      setViewport({
        height: visualViewport?.height ?? window.innerHeight,
        top: visualViewport?.offsetTop ?? 0,
      });
    }

    updateViewport();

    const visualViewport = window.visualViewport;

    visualViewport?.addEventListener("resize", updateViewport);
    visualViewport?.addEventListener("scroll", updateViewport);
    window.addEventListener("resize", updateViewport);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;

      visualViewport?.removeEventListener("resize", updateViewport);
      visualViewport?.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
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

  const visibleHeight = viewport?.height ?? windowFallbackHeight();
  const visibleTop = viewport?.top ?? 0;

  return (
    <div
      className="fixed left-0 right-0 z-50 flex items-center justify-center overflow-y-auto overscroll-contain bg-navy-950/80 px-3 py-3 backdrop-blur-md sm:px-4"
      style={{
        top: `${visibleTop}px`,
        height: `${visibleHeight}px`,
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className={`my-auto w-full ${maxWidthClass} overflow-y-auto overscroll-contain rounded-3xl border border-navy-700 bg-navy-900 p-4 text-slate-100 shadow-2xl transition sm:p-6`}
        style={{
          maxHeight: `${Math.max(120, visibleHeight - 24)}px`,
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div className="mb-5 flex items-start justify-between gap-3 border-b border-navy-750 pb-3.5">
          <div className="min-w-0">
            <h2
              id="modal-title"
              className="text-xl font-black text-slate-100"
            >
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-xs text-slate-400">
                {description}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar modal"
            className="shrink-0 text-slate-400 hover:bg-navy-800 hover:text-slate-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {children}
      </div>
    </div>
  );
}

function windowFallbackHeight(): number {
  return typeof window !== "undefined" ? window.innerHeight : 600;
}