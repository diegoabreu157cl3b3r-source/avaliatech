
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
  Award,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl select-none lg:max-w-none">
      {/* Brilho de fundo */}
      <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-gold-500/20 via-brand-500/15 to-gold-500/10 opacity-70 blur-2xl" />

      {/* Etiqueta de gabarito */}
      <div className="absolute -top-3 left-2 z-20 inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3 py-1 text-[10px] font-semibold text-slate-100 shadow-xl backdrop-blur-md sm:-top-4 sm:-left-4 sm:text-xs">
        <CheckCircle2 className="h-3.5 w-3.5 text-gold-400" />
        <span>Gabarito automático</span>
      </div>

      {/* Janela principal */}
      <div className="overflow-hidden rounded-2xl border border-navy-750 bg-navy-900 shadow-xl backdrop-blur-xl">
        {/* Barra superior */}
        <div className="flex h-9 items-center justify-between gap-2 border-b border-navy-750 bg-navy-950/80 px-3 sm:px-4">
          <div className="flex shrink-0 items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500/80" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>

          <div className="flex min-w-0 items-center gap-1.5 text-[10px] font-medium text-slate-400 sm:text-xs">
            <Logo variant="symbol" size="sm" className="h-3 w-auto shrink-0" />
            <span className="truncate">AvaliaTech — Central de Avaliações</span>
          </div>

          <div className="w-3 shrink-0 text-right sm:w-12">
            <span
              className="inline-block h-2 w-2 rounded-full bg-emerald-500"
              title="Online"
            />
          </div>
        </div>

        {/* Corpo do dashboard */}
        <div className="flex min-h-[360px] bg-navy-950/90 sm:min-h-[400px]">
          {/* Menu lateral */}
          <aside className="hidden w-40 shrink-0 flex-col border-r border-navy-750 bg-navy-900 p-2.5 sm:flex">
            <div className="mb-2 flex items-center gap-2 px-2 py-1 text-xs font-bold text-slate-100">
              <div className="h-1.5 w-1.5 rounded-sm bg-gold-500" />
              Painel Docente
            </div>

            <nav className="space-y-0.5 text-xs">
              <div className="flex items-center gap-2 rounded-lg border border-navy-750 bg-navy-850 px-2 py-1.5 font-semibold text-gold-400">
                <LayoutDashboard className="h-3 w-3" />
                Início
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400">
                <BookOpen className="h-3 w-3" />
                Questões
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400">
                <Sparkles className="h-3 w-3 text-gold-400" />
                Gerar prova
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400">
                <History className="h-3 w-3" />
                Provas Geradas
              </div>
              <div className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-slate-400">
                <User className="h-3 w-3" />
                Perfil
              </div>
            </nav>

            <div className="mt-auto border-t border-navy-750 pt-2">
              <div className="flex items-center gap-2 px-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-[10px] font-bold text-gold-400">
                  P
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-semibold text-slate-100">
                    Prof. Roberto
                  </p>
                  <p className="truncate text-[8px] text-slate-400">
                    Ensino Médio
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Conteúdo do dashboard */}
          <div className="min-w-0 flex-1 space-y-3 p-3.5 sm:p-4">
            {/* Saudação */}
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-100 sm:text-sm">
                  Olá, Professor! 👋
                </h4>
                <p className="text-[10px] text-slate-400">
                  Pronto para gerar sua próxima avaliação escolar.
                </p>
              </div>

              <span className="hidden shrink-0 items-center gap-1 rounded-md border border-navy-750 bg-navy-850 px-2 py-0.5 text-[9px] font-semibold text-gold-400 sm:inline-flex">
                <Sparkles className="h-2.5 w-2.5" />
                IA Conectada
              </span>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div className="min-w-0 rounded-xl border border-navy-750 bg-navy-900 p-2">
                <p className="text-[9px] font-semibold text-slate-400">Questões</p>
                <p className="text-sm font-black text-slate-100 sm:text-base">248</p>
                <span className="text-[8px] font-medium text-emerald-500">+14 novas</span>
              </div>

              <div className="min-w-0 rounded-xl border border-navy-750 bg-navy-900 p-2">
                <p className="text-[9px] font-semibold text-slate-400">Disciplinas</p>
                <p className="text-sm font-black text-slate-100 sm:text-base">12</p>
                <span className="text-[8px] font-medium text-gold-400">Cadastradas</span>
              </div>

              <div className="min-w-0 rounded-xl border border-navy-750 bg-navy-900 p-2">
                <p className="text-[9px] font-semibold text-slate-400">Provas</p>
                <p className="text-sm font-black text-slate-100 sm:text-base">37</p>
                <span className="text-[8px] font-medium text-sky-500">Geradas</span>
              </div>
            </div>

            {/* Atividade recente */}
            <div className="relative rounded-xl border border-navy-750 bg-navy-900 p-2.5 pb-28 sm:pb-2.5">
              {/* A etiqueta fica acima da atividade, sem cobrir os registros */}
              <div className="absolute left-2 top-0 z-10 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3 py-1 text-[10px] font-semibold text-slate-100 shadow-xl sm:-left-3 sm:text-xs">
                <Shuffle className="h-3 w-3 text-gold-400" />
                <span>Versões A / B</span>
              </div>

              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold text-slate-100">
                  Atividade recente
                </span>
                <span className="text-[9px] text-slate-400">Hoje</span>
              </div>

              <div className="space-y-1 text-[10px]">
                <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-navy-750 bg-navy-850 px-2 py-1">
                  <span className="flex min-w-0 items-center gap-1.5 text-slate-100">
                    <PlusCircle className="h-3 w-3 shrink-0 text-emerald-500" />
                    <span className="truncate">5 questões geradas com IA</span>
                  </span>
                  <span className="shrink-0 text-[8px] text-slate-400">há 12 min</span>
                </div>

                <div className="flex min-w-0 items-center justify-between gap-2 rounded-lg border border-navy-750 bg-navy-850 px-2 py-1">
                  <span className="flex min-w-0 items-center gap-1.5 text-slate-100">
                    <Award className="h-3 w-3 shrink-0 text-gold-400" />
                    <span className="truncate">Prova de Matemática (Versões A/B)</span>
                  </span>
                  <span className="shrink-0 text-[8px] text-slate-400">há 1h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Folha da prova: fluxo normal no celular e sobreposição no PC */}
      <div className="absolute bottom-2 right-2 z-10 w-48 rounded-xl border border-navy-700 bg-navy-900 p-2.5 text-slate-100 shadow-2xl rotate-2 transition duration-300 hover:rotate-0 hover:scale-[1.02] sm:-bottom-8 sm:-right-6 sm:w-72 sm:p-3.5">
        <div className="rounded-lg border border-navy-750 bg-navy-850 p-2 text-center text-[9px]">
          <p className="font-extrabold uppercase tracking-wider text-slate-100">
            AVALIAÇÃO DE MATEMÁTICA
          </p>
          <div className="mt-0.5 flex items-center justify-between gap-1 text-[8px] font-medium text-slate-400">
            <span>Versão A</span>
            <span>Data: 15/09/2026</span>
            <span>Valor: 10,0</span>
          </div>
        </div>

        <div className="mt-1.5 text-[8px] text-slate-300">
          <span className="font-bold">Aluno(a):</span>{" "}
          <span className="inline-block w-32 border-b border-dotted border-slate-400 sm:w-40" />
        </div>

        <div className="mt-2 rounded-md border border-navy-750 bg-navy-850 p-1.5 text-[8px]">
          <p className="font-bold text-slate-100">
            01. (Valor: 1.0) Qual é a solução da equação 2x + 6 = 14?
          </p>

          <div className="mt-1 space-y-0.5 font-medium text-slate-300">
            <p className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full border border-slate-400" />
              A) x = 2
            </p>
            <p className="flex items-center gap-1 font-bold text-emerald-500">
              <span className="flex h-2 w-2 items-center justify-center rounded-full bg-emerald-500 text-[6px] text-white">
                ✓
              </span>
              B) x = 4
            </p>
            <p className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full border border-slate-400" />
              C) x = 6
            </p>
            <p className="flex items-center gap-1">
              <span className="inline-block h-2 w-2 rounded-full border border-slate-400" />
              D) x = 8
            </p>
          </div>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2 font-mono text-[7px] text-slate-400">
          <span>AvaliaTech • Versão A</span>
          <span>Página 1 de 2</span>
        </div>
      </div>
    </div>
  );
}
