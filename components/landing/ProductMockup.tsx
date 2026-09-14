"use client";

import {
  FileText,
  CheckCircle2,
  Shuffle,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Layers,
  History,
  User,
  PlusCircle,
  Award,
  Check
} from "lucide-react";

export function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-2xl lg:max-w-none select-none">
      {/* Glow Effect in Background */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#F5B82E]/20 via-[#0c87eb]/15 to-[#F5B82E]/10 opacity-70 blur-2xl -z-10" />

      {/* Main SaaS Window Frame */}
      <div className="overflow-hidden rounded-2xl border border-[#1E3448] bg-[#0D1B26] shadow-2xl shadow-black/80 backdrop-blur-xl">
        {/* Window Top Bar (Chrome) */}
        <div className="flex h-10 items-center justify-between border-b border-[#1E3448] bg-[#081520] px-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#E54D2E]/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#F5B82E]/80 inline-block" />
            <span className="h-3 w-3 rounded-full bg-[#30A46C]/80 inline-block" />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#AAB8C5]">
            <span className="text-[#F5B82E]">◈</span> AvaliaTech — Central de Avaliações
          </div>
          <div className="w-12 text-right">
            <span className="inline-block h-2 w-2 rounded-full bg-[#30A46C]" title="Online" />
          </div>
        </div>

        {/* Window Body: Sidebar + Dashboard Content */}
        <div className="flex min-h-[380px] sm:min-h-[420px] bg-[#07131C]/90">
          {/* Mockup Sidebar */}
          <aside className="hidden sm:flex w-44 flex-col border-r border-[#1E3448]/80 bg-[#0A1824] p-3">
            <div className="flex items-center gap-2 px-2 py-1.5 mb-3 text-xs font-bold text-[#F8FAFC]">
              <div className="h-2 w-2 rounded-sm bg-[#F5B82E]" />
              Painel Docente
            </div>
            <nav className="space-y-1 text-xs">
              <div className="flex items-center gap-2.5 rounded-lg bg-[#112433] px-2.5 py-2 font-semibold text-[#F5B82E] border border-[#1E3448]/60">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Início
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[#AAB8C5] hover:bg-[#112433]/50">
                <BookOpen className="h-3.5 w-3.5" />
                Questões
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[#AAB8C5] hover:bg-[#112433]/50">
                <Sparkles className="h-3.5 w-3.5 text-[#F5B82E]" />
                Gerar prova
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[#AAB8C5] hover:bg-[#112433]/50">
                <History className="h-3.5 w-3.5" />
                Histórico
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[#AAB8C5] hover:bg-[#112433]/50">
                <User className="h-3.5 w-3.5" />
                Perfil
              </div>
            </nav>

            <div className="mt-auto border-t border-[#1E3448]/60 pt-3">
              <div className="flex items-center gap-2 px-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#112433] text-[10px] font-bold text-[#F5B82E] border border-[#1E3448]">
                  P
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] font-semibold text-[#F8FAFC]">Prof. Roberto</p>
                  <p className="truncate text-[9px] text-[#AAB8C5]">Ensino Médio</p>
                </div>
              </div>
            </div>
          </aside>

          {/* Mockup Main View */}
          <div className="flex-1 p-4 sm:p-5 space-y-4">
            {/* Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm sm:text-base font-bold text-[#F8FAFC]">
                  Olá, Professor! 👋
                </h4>
                <p className="text-[11px] text-[#AAB8C5]">
                  Pronto para gerar sua próxima avaliação escolar.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-md bg-[#112433] px-2 py-1 text-[10px] font-semibold text-[#F5B82E] border border-[#1E3448]">
                <Sparkles className="h-3 w-3" /> IA Conectada
              </span>
            </div>

            {/* Metric Stat Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              <div className="rounded-xl border border-[#1E3448] bg-[#0D1B26] p-2.5">
                <p className="text-[10px] font-semibold text-[#AAB8C5]">Questões</p>
                <p className="text-base sm:text-lg font-black text-[#F8FAFC]">248</p>
                <span className="text-[9px] text-emerald-400 font-medium">+14 novas</span>
              </div>
              <div className="rounded-xl border border-[#1E3448] bg-[#0D1B26] p-2.5">
                <p className="text-[10px] font-semibold text-[#AAB8C5]">Disciplinas</p>
                <p className="text-base sm:text-lg font-black text-[#F8FAFC]">12</p>
                <span className="text-[9px] text-[#F5B82E] font-medium">Cadastradas</span>
              </div>
              <div className="rounded-xl border border-[#1E3448] bg-[#0D1B26] p-2.5">
                <p className="text-[10px] font-semibold text-[#AAB8C5]">Provas</p>
                <p className="text-base sm:text-lg font-black text-[#F8FAFC]">37</p>
                <span className="text-[9px] text-sky-400 font-medium">Geradas</span>
              </div>
            </div>

            {/* Recent Activity List in Mockup */}
            <div className="rounded-xl border border-[#1E3448] bg-[#0D1B26] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#F8FAFC]">Atividade recente</span>
                <span className="text-[10px] text-[#AAB8C5]">Hoje</span>
              </div>
              <div className="space-y-1.5 text-[11px]">
                <div className="flex items-center justify-between rounded-lg bg-[#112433]/70 px-2.5 py-1.5 border border-[#1E3448]/40">
                  <span className="flex items-center gap-2 text-[#F8FAFC]">
                    <PlusCircle className="h-3.5 w-3.5 text-emerald-400" />
                    5 questões geradas com IA
                  </span>
                  <span className="text-[9px] text-[#AAB8C5]">há 12 min</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-[#112433]/70 px-2.5 py-1.5 border border-[#1E3448]/40">
                  <span className="flex items-center gap-2 text-[#F8FAFC]">
                    <Award className="h-3.5 w-3.5 text-[#F5B82E]" />
                    Prova de Matemática (Versões A/B)
                  </span>
                  <span className="text-[9px] text-[#AAB8C5]">há 1h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OVERLAY: Physical Printed Exam Sheet Mockup */}
      <div className="absolute -bottom-6 -right-2 sm:-bottom-8 sm:-right-6 w-64 sm:w-80 rounded-xl border border-slate-300 bg-[#FAFBFD] p-3.5 sm:p-4 text-slate-900 shadow-2xl shadow-black/90 rotate-2 transition duration-300 hover:rotate-0 hover:scale-[1.02]">
        {/* Header of printed sheet */}
        <div className="rounded-lg border border-slate-200 bg-slate-100/80 p-2 text-center text-[10px]">
          <p className="font-extrabold uppercase tracking-wider text-slate-800">
            AVALIAÇÃO DE MATEMÁTICA
          </p>
          <div className="mt-1 flex items-center justify-between text-[8px] text-slate-600 font-medium">
            <span>Versão A</span>
            <span>Data: 15/09/2026</span>
            <span>Valor: 10,0</span>
          </div>
        </div>

        {/* Student Name line */}
        <div className="mt-2 text-[9px] text-slate-700">
          <span className="font-bold">Aluno(a):</span>{" "}
          <span className="border-b border-dotted border-slate-400 inline-block w-36 sm:w-48" />
        </div>

        {/* Sample Question on Paper */}
        <div className="mt-2.5 rounded-md border border-slate-100 bg-white p-2 text-[9px]">
          <p className="font-bold text-slate-900">
            01. (Valor: 1.0) Qual é a solução da equação 2x + 6 = 14?
          </p>
          <div className="mt-1.5 space-y-0.5 text-slate-700 font-medium">
            <p className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-400 inline-block" /> A) x = 2
            </p>
            <p className="flex items-center gap-1 font-bold text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[7px]">✓</span> B) x = 4
            </p>
            <p className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-400 inline-block" /> C) x = 6
            </p>
            <p className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full border border-slate-400 inline-block" /> D) x = 8
            </p>
          </div>
        </div>

        {/* Page footer on paper */}
        <div className="mt-2 flex items-center justify-between text-[7px] text-slate-500 font-mono">
          <span>AvaliaTech • Versão A</span>
          <span>Página 1 de 2</span>
        </div>
      </div>

      {/* Floating Micro-Badge 1: Gabarito Automático */}
      <div className="absolute -top-3 sm:-top-4 -left-2 sm:-left-4 inline-flex items-center gap-1.5 rounded-full border border-[#1E3448] bg-[#112433] px-3 py-1.5 text-xs font-bold text-[#F8FAFC] shadow-xl backdrop-blur-md animate-bounce [animation-duration:4s]">
        <CheckCircle2 className="h-4 w-4 text-[#F5B82E]" />
        <span>Gabarito automático</span>
      </div>

      {/* Floating Micro-Badge 2: Versões A/B */}
      <div className="absolute top-1/2 -left-3 sm:-left-6 -translate-y-1/2 inline-flex items-center gap-1.5 rounded-full border border-[#1E3448] bg-[#0D1B26] px-3.5 py-1.5 text-xs font-bold text-[#F8FAFC] shadow-xl backdrop-blur-md">
        <Shuffle className="h-3.5 w-3.5 text-[#F5B82E]" />
        <span>Versões A / B</span>
      </div>
    </div>
  );
}

