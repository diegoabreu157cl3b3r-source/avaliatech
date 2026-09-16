"use client";

import { Menu, LogOut, Bell } from "lucide-react";
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

  const firstName = user?.nome ? user.nome.split(" ")[0] : "Professor";

  return (
    <header className="sticky top-0 z-20 border-b border-navy-750 bg-navy-950/80 backdrop-blur-md transition">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 lg:px-6">
        <div className="flex items-center gap-3">
          <Button type="button" variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden sm:block">
            <span className="text-xs font-semibold text-slate-400">Painel Docente</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Profile Pill */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white shadow-sm">
              {firstName.charAt(0).toUpperCase()}
            </span>
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-slate-100 leading-tight">{firstName}</p>
              <p className="text-[10px] text-slate-400 leading-tight">Professor(a)</p>
            </div>
          </div>

          <div className="h-4 w-px bg-navy-750 mx-1 hidden sm:block" />

          {/* Sair Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-navy-850 hover:text-rose-400"
            title="Encerrar sessão"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </div>
    </header>
  );
}
