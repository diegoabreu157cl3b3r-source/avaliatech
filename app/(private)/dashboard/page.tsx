"use client";

import Link from "next/link";
import { BookOpen, FileText, Layers, PlusCircle, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { getDashboardStats, type DashboardStats } from "@/services/dashboard-service";

const cards = [
  { key: "totalQuestoes", label: "Questões", icon: FileText },
  { key: "totalDisciplinas", label: "Disciplinas", icon: BookOpen },
  { key: "totalAssuntos", label: "Assuntos", icon: Layers },
  { key: "totalProvas", label: "Provas geradas", icon: Trophy }
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
      <section className="rounded-3xl bg-gradient-to-br from-slate-950 to-brand-900 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-100">Painel do professor</p>
        <h1 className="mt-2 text-3xl font-black">Dashboard AvaliaTech</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
          Acompanhe seu banco de questões, cadastre novos itens e gere provas em PDF com versões A/B e gabaritos independentes.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/questoes" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-950">
            <PlusCircle className="h-4 w-4" /> Nova questão
          </Link>
          <Link href="/gerar-prova" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 px-4 py-3 text-sm font-bold text-white">
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
                <article key={card.key} className="card">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                      <strong className="mt-2 block text-3xl font-black text-slate-900">{value}</strong>
                    </div>
                    <span className="rounded-2xl bg-brand-50 p-3 text-brand-700">
                      <Icon className="h-6 w-6" />
                    </span>
                  </div>
                </article>
              );
            })}
      </section>

      <section className="card">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-slate-900">Questões recentes</h2>
            <p className="mt-1 text-sm text-slate-500">Últimos cadastros realizados.</p>
          </div>
          <Link href="/questoes" className="text-sm font-bold text-brand-700">Ver todas</Link>
        </div>

        <div className="space-y-3">
          {isLoading && <Skeleton className="h-24" />}
          {!isLoading && stats?.recentQuestions.length === 0 && (
            <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Nenhuma questão cadastrada ainda.</p>
          )}
          {stats?.recentQuestions.map((question) => (
            <article key={question.id} className="rounded-2xl border border-slate-200 p-4">
              <p className="line-clamp-2 text-sm font-bold text-slate-900">{question.pergunta}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{question.disciplina}</span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{question.assunto}</span>
                <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{question.dificuldade}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
