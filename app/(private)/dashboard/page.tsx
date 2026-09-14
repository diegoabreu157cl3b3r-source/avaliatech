"use client";

import Link from "next/link";
import { BookOpen, FileText, Layers, PlusCircle, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDashboardStats, type DashboardStats } from "@/services/dashboard-service";

import { DifficultyChart } from "@/components/dashboard/DifficultyChart";
import { DisciplineChart } from "@/components/dashboard/DisciplineChart";
import { RecentActivityTimeline } from "@/components/dashboard/RecentActivityTimeline";

const cards = [
  { key: "totalQuestoes", label: "Questões", icon: FileText, href: "/questoes" },
  { key: "totalDisciplinas", label: "Disciplinas", icon: BookOpen, href: "/questoes" },
  { key: "totalAssuntos", label: "Assuntos", icon: Layers, href: "/questoes" },
  { key: "totalProvas", label: "Provas geradas", icon: Trophy, href: "/provas" }
] as const;

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await getDashboardStats();
        setStats(response.data ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const totalQuestoes = stats?.totalQuestoes ?? 0;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-navy-700 bg-gradient-to-br from-navy-900 via-navy-850 to-navy-950 p-6 sm:p-8 text-slate-100 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-widest text-gold-400">Painel do professor</p>
        <h1 className="mt-2 text-2xl font-black sm:text-3xl text-slate-100">Dashboard AvaliaTech</h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-300">
          Acompanhe seu banco de questões, analise estatísticas por dificuldade e disciplina, e gere provas com distribuição inteligente e versões A/B.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/questoes"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 text-sm font-black text-navy-950 shadow-md transition hover:bg-gold-400 active:scale-95"
          >
            <PlusCircle className="h-4 w-4" /> Nova questão
          </Link>
          <Link
            href="/gerar-prova"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-navy-600 bg-navy-850 px-5 py-3 text-sm font-bold text-slate-100 transition hover:bg-navy-800 hover:border-navy-500"
          >
            Gerar prova
          </Link>
        </div>
      </section>

      {/* Contadores Principais */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => <Skeleton key={index} className="h-32" />)
          : cards.map((card) => {
              const Icon = card.icon;
              const value = stats?.[card.key] ?? 0;
              return (
                <Link
                  key={card.key}
                  href={card.href}
                  aria-label={`Ver ${card.label.toLowerCase()}`}
                  className="card block cursor-pointer transition duration-200 hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.label}</p>
                      <strong className="mt-2 block text-3xl font-black text-slate-100">{value}</strong>
                    </div>
                    <span className="rounded-2xl border border-navy-700 bg-navy-850 p-3 text-gold-400 shadow-inner">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                </Link>
              );
            })}
      </section>

      {/* Gráficos de Estatísticas */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Gráfico 1: Dificuldade */}
        <div className="card">
          <div className="mb-4">
            <h2 className="text-lg font-black text-slate-100">
              Questões por Dificuldade
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Distribuição de itens entre Fácil, Média e Difícil.
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-36" />
          ) : (
            <DifficultyChart
              data={stats?.questoesPorDificuldade ?? []}
              totalQuestoes={totalQuestoes}
            />
          )}
        </div>

        {/* Gráfico 2: Disciplina */}
        <div className="card">
          <div className="mb-4">
            <h2 className="text-lg font-black text-slate-100">
              Questões por Disciplina
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Quantidade de itens cadastrados em cada matéria.
            </p>
          </div>
          {isLoading ? (
            <Skeleton className="h-36" />
          ) : (
            <DisciplineChart
              data={stats?.questoesPorDisciplina ?? []}
              totalQuestoes={totalQuestoes}
            />
          )}
        </div>
      </section>

      {/* Atividades Recentes & Questões Recentes */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Atividade Recente */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-100">
                Atividade recente
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Histórico recente de criações, edições e provas.
              </p>
            </div>
          </div>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : (
            <RecentActivityTimeline activities={stats?.recentActivities ?? []} />
          )}
        </div>

        {/* Questões Recentes */}
        <div className="card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-slate-100">
                Questões recentes
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Últimos itens cadastrados no seu banco.
              </p>
            </div>
            <Link
              href="/questoes"
              className="text-xs font-bold text-gold-400 hover:text-gold-300 hover:underline"
            >
              Ver todas
            </Link>
          </div>

          <div className="space-y-3">
            {isLoading && <Skeleton className="h-48" />}
            {!isLoading && (!stats?.recentQuestions || stats.recentQuestions.length === 0) && (
              <p className="rounded-2xl border border-navy-700 bg-navy-850/40 p-4 text-center text-sm font-medium text-slate-400">
                Nenhuma questão cadastrada ainda.
              </p>
            )}
            {stats?.recentQuestions?.map((question) => (
              <article
                key={question.id}
                className="rounded-2xl border border-navy-700 bg-navy-850/40 p-3.5 transition hover:border-navy-600 hover:bg-navy-850"
              >
                <p className="line-clamp-2 text-sm font-bold text-slate-100">
                  {question.pergunta}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 text-xs font-semibold">
                  <span className="rounded-full bg-navy-700 px-3 py-0.5 font-bold text-gold-400 border border-gold-500/20">
                    {question.disciplina}
                  </span>
                  <span className="rounded-full border border-navy-700 bg-navy-900 px-3 py-0.5 text-slate-300">
                    {question.assunto}
                  </span>
                  <span
                    className={`rounded-full border px-3 py-0.5 font-bold ${
                      question.dificuldade === "Fácil"
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                        : question.dificuldade === "Média"
                        ? "border-amber-500/40 bg-amber-950/40 text-amber-400"
                        : "border-rose-500/40 bg-rose-950/40 text-rose-400"
                    }`}
                  >
                    {question.dificuldade}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
