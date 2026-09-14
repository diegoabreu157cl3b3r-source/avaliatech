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

const navigationSections = [
  {
    title: "VISÃO GERAL",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard }
    ]
  },
  {
    title: "BANCO & PROVAS",
    items: [
      { href: "/questoes", label: "Questões", icon: FileText },
      { href: "/gerar-prova", label: "Gerar Prova", icon: BarChart3, highlight: true },
      { href: "/provas", label: "Histórico", icon: History }
    ]
  },
  {
    title: "CONTA",
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
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col overflow-y-auto border-r border-navy-700 bg-navy-900 p-5 transition duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 text-lg font-black tracking-tight text-slate-100"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-500 font-black text-navy-950 shadow-md">
              ◈
            </span>
            <span>Avalia<span className="text-gold-400">Tech</span></span>
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
            <div key={section.title} className="space-y-1.5">
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {section.title}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition ${
                        active
                          ? "border border-navy-700 bg-navy-850 text-gold-400 shadow-sm"
                          : "text-slate-300 hover:border-transparent hover:bg-navy-850/60 hover:text-slate-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4.5 w-4.5 ${active ? "text-gold-400" : "text-slate-400"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.highlight && !active && (
                        <span className="flex items-center gap-1 rounded-md bg-gold-500/15 px-1.5 py-0.5 text-[10px] font-extrabold text-gold-400 border border-gold-500/25">
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

        <div className="mt-auto border-t border-navy-700/80 pt-4 text-center">
          <p className="text-[11px] text-slate-400">
            AvaliaTech &bull; SaaS Acadêmico
          </p>
        </div>
      </aside>
    </>
  );
}

