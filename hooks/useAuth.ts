"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { AuthUser } from "@/types/user";

export function useAuth(redirectTo = "/login") {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          router.push(redirectTo);
          return;
        }
        const json = await response.json();
        setUser(json.data.user);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [redirectTo, router]);

  return { user, isLoading };
}
