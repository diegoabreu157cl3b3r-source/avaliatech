"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, History, LayoutDashboard, User, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/questoes", label: "Questões", icon: FileText },
  { href: "/gerar-prova", label: "Gerar Prova", icon: BarChart3 },
  { href: "/provas", label: "Histórico", icon: History },
  { href: "/perfil", label: "Perfil", icon: User }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}`} onClick={onClose} />
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white p-4 transition duration-300 lg:static lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="rounded-2xl bg-slate-950 px-4 py-3 text-lg font-black text-white">
            AvaliaTech
          </Link>
          <Button type="button" variant="ghost" className="h-10 w-10 p-0 lg:hidden" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 flex flex-col gap-2">
          {links.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${active ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
