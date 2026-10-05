"use client";

import Link from "next/link";
import {
  Plus,
  Sparkles,
  Sun,
  FileText,
  BookOpen,
  Tag,
  Award,
  Calendar,
  ArrowRight
} from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardStats, type DashboardStats } from "@/services/dashboard-service";
import { getExams } from "@/services/exam-service";
import type { Prova } from "@/types/exam";

import { DifficultyChart } from "@/components/dashboard/DifficultyChart";
import { DisciplineChart } from "@/components/dashboard/DisciplineChart";
import { RecentActivityTimeline } from "@/components/dashboard/RecentActivityTimeline";
import { RecentExamsCard } from "@/components/dashboard/RecentExamsCard";
import { HeroAssessmentIllustration } from "@/components/dashboard/DashboardIllustrations";

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentExams, setRecentExams] = useState<Prova[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [statsRes, examsRes] = await Promise.all([
          getDashboardStats().catch(() => ({ data: null })),
          getExams({ limit: 4 }).catch(() => ({ data: null }))
        ]);
        setStats(statsRes.data ?? null);
        setRecentExams(examsRes.data?.items ?? []);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  const totalQuestoes = stats?.totalQuestoes ?? 0;
  const firstName = user?.nome ? user.nome.split(" ")[0] : "";

  // Dynamic greeting based on current time
  const currentHour = new Date().getHours();
  const greeting =
    currentHour >= 5 && currentHour < 12
      ? "Bom dia"
      : currentHour >= 12 && currentHour < 18
      ? "Boa tarde"
      : "Boa noite";

  return (
    <div className="space-y-6">
      {/* 1. Header com Saudação & Ações Principais */}
      <section className="relative overflow-hidden rounded-2xl border border-navy-750 bg-navy-900 p-4 sm:p-5 shadow-sm">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400 border border-gold-500/20 mt-0.5 shadow-sm">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
                {greeting}, {firstName || "Professor"}!
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Aqui está um resumo do seu banco de questões e avaliações.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/questoes"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-navy-700 bg-navy-850/80 px-3.5 py-2 text-xs font-semibold text-slate-100 transition hover:bg-navy-800 hover:border-gold-500/40 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" /> Nova questão
            </Link>
            <Link
              href="/gerar-prova"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-xs font-bold text-white dark:text-navy-950 shadow-sm shadow-gold-500/15 transition hover:bg-gold-400 active:scale-95"
            >
              <Sparkles className="h-3.5 w-3.5" /> Gerar prova
            </Link>
          </div>
        </div>

        {/* Ilustração sutil no fundo/centro-direito do Hero */}
        <div className="pointer-events-none absolute right-64 top-1/2 -translate-y-1/2 hidden 2xl:block opacity-40">
          <HeroAssessmentIllustration className="h-16 w-32" />
        </div>
      </section>

      {/* 2. Métricas Principais (4 Cards Alinhados) */}
      <section className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {/* Questões */}
        <div className="rounded-2xl border border-navy-750 bg-navy-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-850 border border-navy-700 text-gold-400">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Questões</p>
              {isLoading ? (
                <Skeleton className="h-6 w-12 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-extrabold text-slate-100">{stats?.totalQuestoes ?? 0}</p>
              )}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-emerald-500 font-medium">No banco de itens</p>
        </div>

        {/* Disciplinas */}
        <div className="rounded-2xl border border-navy-750 bg-navy-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-850 border border-navy-700 text-gold-400">
              <BookOpen className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Disciplinas</p>
              {isLoading ? (
                <Skeleton className="h-6 w-12 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-extrabold text-slate-100">{stats?.totalDisciplinas ?? 0}</p>
              )}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-gold-400 font-medium">Matérias ativas</p>
        </div>

        {/* Assuntos */}
        <div className="rounded-2xl border border-navy-750 bg-navy-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-850 border border-navy-700 text-gold-400">
              <Tag className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Assuntos</p>
              {isLoading ? (
                <Skeleton className="h-6 w-12 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-extrabold text-slate-100">{stats?.totalAssuntos ?? 0}</p>
              )}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-sky-500 font-medium">Tópicos mapeados</p>
        </div>

        {/* Provas geradas */}
        <div className="rounded-2xl border border-navy-750 bg-navy-900 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-850 border border-navy-700 text-gold-400">
              <Award className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-400">Provas geradas</p>
              {isLoading ? (
                <Skeleton className="h-6 w-12 mt-1" />
              ) : (
                <p className="text-lg sm:text-xl font-extrabold text-slate-100">{stats?.totalProvas ?? 0}</p>
              )}
            </div>
          </div>
          <p className="mt-2 text-[10px] text-gold-400 font-medium">Versões A e B</p>
        </div>
      </section>

      {/* 3. Grid Central: Dificuldade (Donut) | Disciplina (Barras) | Atividade Recente (Timeline) */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Card 1: Distribuição por Dificuldade */}
        <div className="rounded-2xl border border-navy-750 bg-navy-900 p-5 shadow-sm flex flex-col justify-center min-h-[220px]">
          <div className="mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-slate-100">
              Distribuição por Dificuldade
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Como as questões estão distribuídas no seu banco.
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {isLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <DifficultyChart
                data={stats?.questoesPorDificuldade ?? []}
                totalQuestoes={totalQuestoes}
              />
            )}
          </div>
        </div>

        {/* Card 2: Por Disciplina */}
        <div className="rounded-2xl border border-navy-750 bg-navy-900 p-5 shadow-sm flex flex-col justify-center min-h-[220px]">
          <div className="mb-4">
            <h2 className="text-xs sm:text-sm font-bold text-slate-100">
              Por Disciplina
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Quantidade de questões por disciplina.
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {isLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <DisciplineChart
                data={stats?.questoesPorDisciplina ?? []}
                totalQuestoes={totalQuestoes}
              />
            )}
          </div>
        </div>

        {/* Card 3: Atividade recente */}
        <div className="rounded-2xl border border-navy-750 bg-navy-900 p-5 shadow-sm flex flex-col justify-center min-h-[220px]">
          <div className="mb-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-slate-100">
                Atividade recente
              </h2>
              <Link
                href="/provas"
                className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition"
              >
                Ver todas &rarr;
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Últimas ações no sistema.
            </p>
          </div>
          <div className="flex-1 flex flex-col justify-center">
            {isLoading ? (
              <Skeleton className="h-32" />
            ) : (
              <RecentActivityTimeline activities={stats?.recentActivities ?? []} />
            )}
          </div>
        </div>
      </section>

      {/* 4. Grid Inferior: Minhas Provas (Esquerda) + Banners/Atividades (Direita) */}
      <section className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Coluna Esquerda: Minhas Provas */}
        <div className="lg:col-span-7">
          <RecentExamsCard exams={recentExams} isLoading={isLoading} />
        </div>

        {/* Coluna Direita: Gerador Inteligente Banner + Próximas Atividades */}
        <div className="lg:col-span-5 space-y-4">
          {/* Banner Gerador Inteligente */}
          <div className="relative overflow-hidden rounded-2xl border border-navy-750 bg-gradient-to-br from-indigo-950/30 via-navy-900 to-navy-900 p-5 shadow-sm">
            {/* Detalhe gráfico sutil de fundo */}
            <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-10 select-none">
              <svg width="110" height="110" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 3" className="text-gold-400" />
                <path d="M50 22L53 38L69 41L53 44L50 60L47 44L31 41L47 38Z" fill="currentColor" className="text-gold-400" />
              </svg>
            </div>
            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gold-500/20 text-gold-400 border border-gold-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-100">Gerador inteligente</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Crie questões com IA e revise antes de salvar no seu banco.
              </p>
              <Link
                href="/gerar-prova"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-4 py-2 text-xs font-bold text-white dark:text-navy-950 transition hover:bg-gold-400 active:scale-95"
              >
                Acessar gerador <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Card Próximas Atividades */}
          <div className="rounded-2xl border border-navy-750 bg-navy-900 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-2 border-b border-navy-750/70 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <h4 className="text-xs font-bold text-slate-100">Próximas atividades</h4>
              </div>
              <Link
                href="/provas"
                className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 transition"
              >
                Ver histórico &rarr;
              </Link>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Você não possui atividades agendadas. Gere uma nova avaliação para este período letivo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
