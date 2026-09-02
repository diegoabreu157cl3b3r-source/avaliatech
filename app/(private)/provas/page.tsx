"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { http } from "@/services/http";
import { downloadHistoricalExamPdf } from "@/services/exam-service";
import type { ApiResponse, PaginatedResponse } from "@/types/api";
import type { Prova } from "@/types/exam";

export default function ProvasPage() {
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [data, setData] = useState<PaginatedResponse<Prova> | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function loadExams() {
      setIsLoading(true);
      try {
        const response = await http<ApiResponse<PaginatedResponse<Prova>>>(`/api/exams?page=${page}&limit=10`);
        setData(response.data ?? null);
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Erro ao carregar provas.", "error");
      } finally {
        setIsLoading(false);
      }
    }

    loadExams();
  }, [page, showToast]);

  async function handleDownload(exam: Prova) {
    setDownloadingId(exam.id);
    try {
      const blob = await downloadHistoricalExamPdf(exam.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeDiscipline = (exam.disciplina || "prova").toLowerCase().replace(/[^a-z0-9]+/gi, "-");
      link.download = `avaliatech-${safeDiscipline}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("PDF baixado com sucesso.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao baixar PDF.", "error");
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft transition dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700 dark:text-brand-400">Histórico</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900 dark:text-slate-100">Provas geradas</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Registro das provas geradas pelo professor autenticado.</p>
      </section>

      {isLoading && <Skeleton className="h-72" />}
      {!isLoading && (!data || data.items.length === 0) && (
        <EmptyState title="Nenhuma prova gerada" description="Acesse Gerar Prova para criar o primeiro PDF." />
      )}
      {!isLoading && data && data.items.length > 0 && (
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3">Escola</th>
                  <th className="px-4 py-3">Disciplina</th>
                  <th className="px-4 py-3">Assunto</th>
                  <th className="px-4 py-3">Dificuldade</th>
                  <th className="px-4 py-3">Questões</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {data.items.map((exam) => (
                  <tr key={exam.id} className="bg-white transition hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/60">
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{exam.escola}</td>
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">{exam.disciplina}</td>
                    <td className="px-4 py-4 font-semibold text-slate-900 dark:text-slate-100">{exam.assunto}</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                        {exam.dificuldade}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">{exam.quantidade_questoes}</td>
                    <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">{new Date(exam.created_at).toLocaleDateString("pt-BR")}</td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        className="gap-2 px-3 py-1.5 text-xs"
                        onClick={() => handleDownload(exam)}
                        isLoading={downloadingId === exam.id}
                        disabled={downloadingId !== null}
                      >
                        <Download className="h-4 w-4" /> Baixar PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.totalPages > 1 && (
            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
              <p className="text-sm text-slate-500 dark:text-slate-400">Página {data.page} de {data.totalPages} • {data.total} registro(s)</p>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" disabled={data.page <= 1} onClick={() => setPage((current) => current - 1)}>Anterior</Button>
                <Button type="button" variant="ghost" disabled={data.page >= data.totalPages} onClick={() => setPage((current) => current + 1)}>Próxima</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
