"use client";

import { useCallback, useEffect, useState } from "react";

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
  }, []);

  return { toast, showToast };
}
