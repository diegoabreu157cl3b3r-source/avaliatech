"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { logout as apiLogout } from "@/services/auth-service";
import type { AuthUser } from "@/types/user";

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

let inflightMeRequest: Promise<AuthUser | null> | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  const fetchUser = useCallback(async (): Promise<AuthUser | null> => {
    if (inflightMeRequest) {
      return inflightMeRequest;
    }

    inflightMeRequest = (async () => {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });
        if (!response.ok) {
          return null;
        }
        const json = await response.json();
        return json.data?.user ?? null;
      } catch {
        return null;
      } finally {
        inflightMeRequest = null;
      }
    })();

    const result = await inflightMeRequest;
    if (isMountedRef.current) {
      setUser(result);
      setIsLoading(false);
    }
    return result;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchUser();
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchUser]);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    return fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
      router.push("/login");
      router.refresh();
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isLoading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(redirectTo?: string) {
  const router = useRouter();
  const context = useContext(AuthContext);

  useEffect(() => {
    if (redirectTo && context && !context.isLoading && !context.user) {
      router.push(redirectTo);
    }
  }, [context, redirectTo, router]);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
