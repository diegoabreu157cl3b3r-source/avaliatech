"use client";

import {
  CheckCircle2,
  Shuffle,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  History,
  User,
  PlusCircle,
  Award
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none select-none">
      {/* Glow Effect in Background */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-gold-500/20 via-brand-500/15 to-gold-500/10 opacity-70 blur-2xl -z-10" />

      {/* Main SaaS Window Frame */}
      <div className="overflow-hidden rounded-2xl border border-navy-750 bg-navy-900 shadow-xl backdrop-blur-xl">
        {/* Window Top Bar (Chrome) */}
        <div className="flex h-9 items-center justify-between border-b border-navy-750 bg-navy-950/80 px-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
            <Logo variant="symbol" size="sm" className="h-3 w-auto" />
            <span>AvaliaTech — Central de Avaliações</span>
          </div>
          <div className="w-12 text-right">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" title="Online" />
          </div>
        </div>

        {/* Window Body: Sidebar + Dashboard Content */}
        <div className="flex min-h-[360px] sm:min-h-[400px] bg-navy-950/90">
          {/* Mockup Sidebar */}
          <aside className="hidden sm:flex w-40 flex-col border-r border-navy-750 bg-navy-900 p-2.5">
            <div className="flex items-center gap-2 px-2 py-1 mb-2 text-xs font-bold text-slate-100">
              <div className="h-1.5 w-1.5 rounded-sm bg-gold-500" />
              Painel Docente
            </div>
            <nav className="space-y-0.5 text-xs">
              <div className="flex items-center gap-2 rounded-lg bg-navy-850 px-2 py-1.5 font-semibold text-gold-400 border border-navy-750">
                <LayoutDashboard className="h-3 w-3" />
                Início
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400 hover:bg-navy-850/50">
                <BookOpen className="h-3 w-3" />
                Questões
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400 hover:bg-navy-850/50">
                <Sparkles className="h-3 w-3 text-gold-400" />
                Gerar prova
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400 hover:bg-navy-850/50">
                <History className="h-3 w-3" />
                Histórico
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400 hover:bg-navy-850/50">
                <User className="h-3 w-3" />
                Perfil
              </div>
            </nav>

            <div className="mt-auto border-t border-navy-750 pt-2">
              <div className="flex items-center gap-2 px-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-navy-850 text-[10px] font-bold text-gold-400 border border-navy-700">
                  P
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-slate-100">Prof. Roberto</p>
                  <p className="truncate text-[8px] text-slate-400">Ensino Médio</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mockup Main View */}
          <div className="flex-1 p-3.5 sm:p-4 space-y-3">
            {/* Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                  Olá, Professor! 👋
                </h4>
                <p className="text-[10px] text-slate-400">
                  Pronto para gerar sua próxima avaliação escolar.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-navy-850 px-2 py-0.5 text-[9px] font-semibold text-gold-400 border border-navy-750">
                <Sparkles className="h-2.5 w-2.5" /> IA Conectada
              </span>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl border border-navy-750 bg-navy-900 p-2">
                <p className="text-[9px] font-semibold text-slate-400">Questões</p>
                <p className="text-sm sm:text-base font-black text-slate-100">248</p>
                <span className="text-[8px] text-emerald-500 font-medium">+14 novas</span>
              </div>
              <div className="rounded-xl border border-navy-750 bg-navy-900 p-2">
                <p className="text-[9px] font-semibold text-slate-400">Disciplinas</p>
                <p className="text-sm sm:text-base font-black text-slate-100">12</p>
                <span className="text-[8px] text-gold-400 font-medium">Cadastradas</span>
              </div>
              <div className="rounded-xl border border-navy-750 bg-navy-900 p-2">
                <p className="text-[9px] font-semibold text-slate-400">Provas</p>
                <p className="text-sm sm:text-base font-black text-slate-100">37</p>
                <span className="text-[8px] text-sky-500 font-medium">Geradas</span>
              </div>
            </div>

            {/* Recent Activity List in Mockup */}
            <div className="rounded-xl border border-navy-750 bg-navy-900 p-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-100">Atividade recente</span>
                <span className="text-[9px] text-slate-400">Hoje</span>
              </div>
              <div className="space-y-1 text-[10px]">
                <div className="flex items-center justify-between rounded-lg bg-navy-850 px-2 py-1 border border-navy-750">
                  <span className="flex items-center gap-1.5 text-slate-100">
                    <PlusCircle className="h-3 w-3 text-emerald-500" />
                    5 questões geradas com IA
                  </span>
                  <span className="text-[8px] text-slate-400">há 12 min</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-navy-850 px-2 py-1 border border-navy-750">
                  <span className="flex items-center gap-1.5 text-slate-100">
                    <Award className="h-3 w-3 text-gold-400" />
                    Prova de Matemática (Versões A/B)
                  </span>
                  <span className="text-[8px] text-slate-400">há 1h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY: Physical Printed Exam Sheet Mockup */}
      <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-6 w-60 sm:w-72 rounded-xl border border-navy-700 bg-navy-900 p-3 sm:p-3.5 text-slate-100 shadow-2xl rotate-2 transition duration-300 hover:rotate-0 hover:scale-[1.02]">
        {/* Header of printed sheet */}
        <div className="rounded-lg border border-navy-750 bg-navy-850 p-2 text-center text-[9px]">
          <p className="font-extrabold uppercase tracking-wider text-slate-100">
            AVALIAÇÃO DE MATEMÁTICA
          </p>
          <div className="mt-0.5 flex items-center justify-between text-[8px] text-slate-400 font-medium">
            <span>Versão A</span>
            <span>Data: 15/09/2026</span>
            <span>Valor: 10,0</span>
          </div>
        </div>

        {/* Student Name line */}
        <div className="mt-1.5 text-[8px] text-slate-300">
          <span className="font-bold">Aluno(a):</span>{" "}
          <span className="border-b border-dotted border-slate-400 inline-block w-32 sm:w-40" />
        </div>

        {/* Sample Question on Paper */}
        <div className="mt-2 rounded-md border border-navy-750 bg-navy-850 p-1.5 text-[8px]">
          <p className="font-bold text-slate-100">
            01. (Valor: 1.0) Qual é a solução da equação 2x + 6 = 14?
          </p>
          <div className="mt-1 space-y-0.5 text-slate-300 font-medium">
            <p className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full border border-slate-400 inline-block" /> A) x = 2
            </p>
            <p className="flex items-center gap-1 font-bold text-emerald-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[6px]">✓</span> B) x = 4
            </p>
            <p className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full border border-slate-400 inline-block" /> C) x = 6
            </p>
            <p className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full border border-slate-400 inline-block" /> D) x = 8
            </p>
          </div>
        </div>

        {/* Page footer on paper */}
        <div className="mt-1.5 flex items-center justify-between text-[7px] text-slate-400 font-mono">
          <span>AvaliaTech • Versão A</span>
          <span>Página 1 de 2</span>
        </div>
      </div>

      {/* Floating Micro-Badge 1: Gabarito Automático */}
      <div className="absolute -top-3 sm:-top-4 -left-2 sm:-left-4 inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3 py-1 text-xs font-semibold text-slate-100 shadow-xl backdrop-blur-md">
        <CheckCircle2 className="h-3.5 w-3.5 text-gold-400" />
        <span>Gabarito automático</span>
      </div>

      {/* Floating Micro-Badge 2: Versões A/B */}
      <div className="absolute top-1/2 -left-3 sm:-left-6 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3 py-1 text-xs font-semibold text-slate-100 shadow-xl backdrop-blur-md">
        <Shuffle className="h-3 w-3 text-gold-400" />
        <span>Versões A / B</span>
      </div>
    </div>
  );
}
