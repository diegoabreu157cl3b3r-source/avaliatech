"use client";

import Link from "next/link";
import { BookOpen, FileText, Layers, PlusCircle, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDashboardStats, type DashboardStats } from "@/services/dashboard-service";

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

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-brand-950 p-6 text-white shadow-soft dark:border dark:border-slate-800">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-200">Painel do professor</p>
        <h1 className="mt-2 text-3xl font-black">Dashboard AvaliaTech</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
          Acompanhe seu banco de questões, cadastre novos itens e gere provas em PDF com versões A/B e gabaritos independentes.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/questoes"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950 shadow-md transition hover:bg-brand-50 active:scale-95"
          >
            <PlusCircle className="h-4 w-4 text-brand-600" /> Nova questão
          </Link>
          <Link
            href="/gerar-prova"
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/30 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
          >
            Gerar prova
          </Link>
        </div>
      </section>

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
                  className="card block cursor-pointer transition duration-200 hover:-translate-y-1 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600 focus-visible:ring-offset-2"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                      <strong className="mt-2 block text-3xl font-black text-slate-900 dark:text-slate-50">{value}</strong>
                    </div>
                    <span className="rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                </Link>
              );
            })}
      </section>

      <section className="card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Questões recentes</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Últimos cadastros realizados.</p>
          </div>
          <Link href="/questoes" className="text-sm font-bold text-brand-700 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300">Ver todas</Link>
        </div>

        <div className="space-y-3">
          {isLoading && <Skeleton className="h-24" />}
          {!isLoading && stats?.recentQuestions.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">Nenhuma questão cadastrada ainda.</p>
          )}
          {stats?.recentQuestions.map((question) => (
            <article key={question.id} className="rounded-2xl border border-slate-200 p-4 transition dark:border-slate-800 dark:bg-slate-800/40">
              <p className="line-clamp-2 text-sm font-bold text-slate-900 dark:text-slate-100">{question.pergunta}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">{question.disciplina}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{question.assunto}</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">{question.dificuldade}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
