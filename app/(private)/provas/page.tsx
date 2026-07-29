"use client";

import { useEffect, useState } from "react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { http } from "@/services/http";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Prova } from "@/types/exam";

export default function ProvasPage() {
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<PaginatedResponse<Prova> | null>(null);

  useEffect(() => {
    async function loadExams() {
      try {
        const response = await http<ApiResponse<PaginatedResponse<Prova>>>("/api/exams");
        setData(response.data ?? null);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Erro ao carregar provas.", "error");
      } finally {
        setIsLoading(false);
      }
    }

    loadExams();
  }, [showToast]);

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <section className="rounded-3xl bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Histórico</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Provas geradas</h1>
        <p className="mt-2 text-sm text-slate-500">Registro das provas geradas pelo professor autenticado.</p>
      </section>

      {isLoading && <Skeleton className="h-72" />}
      {!isLoading && (!data || data.items.length === 0) && (
        <EmptyState title="Nenhuma prova gerada" description="Acesse Gerar Prova para criar o primeiro PDF." />
      )}
      {!isLoading && data && data.items.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Escola</th>
                  <th className="px-4 py-3">Disciplina</th>
                  <th className="px-4 py-3">Assunto</th>
                  <th className="px-4 py-3">Dificuldade</th>
                  <th className="px-4 py-3">Questões</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.items.map((exam) => (
                  <tr key={exam.id} className="bg-white hover:bg-slate-50">
                    <td className="px-4 py-4 font-semibold text-slate-900">{exam.escola}</td>
                    <td className="px-4 py-4 text-slate-600">{exam.disciplina}</td>
                    <td className="px-4 py-4 text-slate-600">{exam.assunto}</td>
                    <td className="px-4 py-4"><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{exam.dificuldade}</span></td>
                    <td className="px-4 py-4 text-slate-600">{exam.quantidade_questoes}</td>
                    <td className="px-4 py-4 text-slate-600">{new Date(exam.created_at).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
