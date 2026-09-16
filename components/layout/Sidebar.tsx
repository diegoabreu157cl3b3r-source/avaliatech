"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  FileText,
  History,
  LayoutDashboard,
  User,
  X,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";

const navigationSections = [
  {
    title: "Visão geral",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
    ]
  },
  {
    title: "Banco de provas",
    items: [
      { href: "/questoes", label: "Questões", icon: FileText, highlight: true },
      { href: "/gerar-prova", label: "Gerar Prova", icon: BarChart3 },
      { href: "/provas", label: "Histórico", icon: History }
    ]
  },
  {
    title: "Conta",
    items: [
      { href: "/perfil", label: "Perfil", icon: User }
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-navy-950/80 backdrop-blur-md transition lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-navy-800 bg-navy-900 p-5 transition duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center transition hover:opacity-90 py-0.5"
            aria-label="AvaliaTech Dashboard"
          >
            <Logo size="md" />
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-8 flex flex-1 flex-col gap-6">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <p className="px-3 text-xs font-semibold text-slate-400">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        active
                          ? "bg-navy-850 text-gold-400 font-semibold border border-navy-750 shadow-xs"
                          : "text-slate-300 font-medium hover:bg-navy-850/50 hover:text-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`h-4 w-4 ${active ? "text-gold-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.highlight && (
                        <span
                          className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold border ${
                            active
                              ? "bg-gold-500/20 text-gold-400 border-gold-500/30"
                              : "bg-gold-500/10 text-gold-400 border-gold-500/20"
                          }`}
                        >
                          <Sparkles className="h-2.5 w-2.5" /> IA
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-auto border-t border-navy-800 pt-3 text-center">
          <p className="text-[11px] font-normal text-slate-400">
            AvaliaTech &bull; Gestão de Avaliações
          </p>
        </div>
      </aside>
    </>
  );
}

