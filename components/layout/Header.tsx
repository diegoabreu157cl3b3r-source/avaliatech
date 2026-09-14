"use client";

import { Menu, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { logout } from "@/services/auth-service";
import type { AuthUser } from "@/types/user";

interface HeaderProps {
  user: AuthUser | null;
  onMenuClick: () => void;
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-20 border-b border-navy-700 bg-navy-950/90 backdrop-blur-md transition">
      <div className="flex items-center justify-between gap-3 px-4 py-3.5 lg:px-6">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Professor(a)</p>
            <h1 className="text-base font-black text-slate-100 sm:text-lg">{user?.nome ?? "Carregando..."}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="ghost" onClick={handleLogout} className="gap-2 text-xs">
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sair</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
