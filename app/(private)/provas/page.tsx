"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Download, Eye, RefreshCw, Copy, Trash2, Calendar, Award, School, User, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { ExamFilters } from "@/components/exams/ExamFilters";
import { ExamPreviewModal } from "@/components/exams/ExamPreviewModal";
import {
  deleteExam,
  downloadHistoricalExamPdf,
  generateExamPdf,
  getExamDetails,
  getExams
} from "@/services/exam-service";
import type { PaginatedResponse } from "@/types/api";
import type { ExamDataPayload, ExamFilters as ExamFiltersType, Prova } from "@/types/exam";

export default function ProvasPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [deletingExam, setDeletingExam] = useState<Prova | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Preview Modal
  const [previewExam, setPreviewExam] = useState<Prova | null>(null);
  const [previewPayload, setPreviewPayload] = useState<ExamDataPayload | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Data & Filters
  const [data, setData] = useState<PaginatedResponse<Prova> | null>(null);
  const [filters, setFilters] = useState<ExamFiltersType>({
    page: 1,
    limit: 10,
    search: "",
    dificuldade: "Todas",
    periodo: "todos"
  });

  const loadExams = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await getExams(filters);
      setData(response.data ?? null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao carregar provas.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadExams();
  }, [loadExams]);

  function handleFilterChange(newFilters: Partial<ExamFiltersType>) {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }

  function handleResetFilters() {
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      dificuldade: "Todas",
      periodo: "todos"
    });
  }

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

  async function handleOpenPreview(exam: Prova) {
    setIsPreviewLoading(true);
    try {
      const response = await getExamDetails(exam.id);
      if (response.data) {
        setPreviewExam(response.data.exam);
        setPreviewPayload(response.data.dataPayload);
      }
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao carregar detalhes da prova.", "error");
    } finally {
      setIsPreviewLoading(false);
    }
  }

  async function handleRegenerate(exam: Prova) {
    setRegeneratingId(exam.id);
    try {
      const detailsRes = await getExamDetails(exam.id);
      if (!detailsRes.data?.dataPayload) {
        throw new Error("Não foi possível obter os parâmetros da prova.");
      }

      const header = detailsRes.data.dataPayload.header;
      const blob = await generateExamPdf(header);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const safeDiscipline = (exam.disciplina || "prova").toLowerCase().replace(/[^a-z0-9]+/gi, "-");
      link.download = `avaliatech-${safeDiscipline}-regerada.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      showToast("Nova prova regerada e baixada com sucesso.", "success");
      loadExams();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao regerar prova.", "error");
    } finally {
      setRegeneratingId(null);
    }
  }

  function handleDuplicate(exam: Prova) {
    router.push(`/gerar-prova?duplicar=${exam.id}`);
  }

  async function handleConfirmDelete() {
    if (!deletingExam) return;
    setIsDeleting(true);
    try {
      await deleteExam(deletingExam.id);
      showToast("Prova excluída com sucesso.", "success");
      setDeletingExam(null);
      loadExams();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao excluir prova.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  const totalPages = data?.totalPages ?? 1;
  const currentPage = filters.page ?? 1;

  // Gerador de páginas numéricas para paginação real
  const pageNumbers: number[] = [];
  const maxPagesToShow = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
  if (endPage - startPage + 1 < maxPagesToShow) {
    startPage = Math.max(1, endPage - maxPagesToShow + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <section className="rounded-3xl border border-navy-700 bg-navy-900 p-5 sm:p-6 shadow-soft transition text-slate-100">
        <p className="text-xs font-bold uppercase tracking-wider text-gold-400">Histórico</p>
        <h1 className="mt-1 text-2xl font-black text-slate-100">Provas geradas</h1>
        <p className="mt-1.5 text-sm text-slate-400">
          Gerencie, visualize, baixe, regere e duplique suas provas geradas anteriormente.
        </p>
      </section>

      {/* Barra de Filtros e Busca */}
      <ExamFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
      />

      {isLoading && <Skeleton className="h-72" />}

      {!isLoading && (!data || data.items.length === 0) && (
        <EmptyState
          title="Nenhuma prova encontrada"
          description={
            filters.search || (filters.dificuldade && filters.dificuldade !== "Todas")
              ? "Tente ajustar os filtros ou o termo de busca."
              : "Acesse Gerar Prova para criar o primeiro PDF."
          }
        />
      )}

      {!isLoading && data && data.items.length > 0 && (
        <div className="card overflow-hidden p-0">
          {/* Tabela para Desktop */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-left text-sm">
              <thead className="border-b border-navy-700 bg-navy-850 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3.5">Escola</th>
                  <th className="px-4 py-3.5">Disciplina</th>
                  <th className="px-4 py-3.5">Assunto</th>
                  <th className="px-4 py-3.5">Dificuldade</th>
                  <th className="px-4 py-3.5">Questões</th>
                  <th className="px-4 py-3.5">Data</th>
                  <th className="px-4 py-3.5 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {data.items.map((exam) => (
                  <tr key={exam.id} className="bg-navy-900 transition hover:bg-navy-850">
                    <td className="px-4 py-4 font-semibold text-slate-100">{exam.escola}</td>
                    <td className="px-4 py-4 font-medium text-slate-300">{exam.disciplina}</td>
                    <td className="px-4 py-4 font-semibold text-slate-100">{exam.assunto}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                          exam.dificuldade === "Fácil"
                            ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                            : exam.dificuldade === "Média"
                            ? "border-amber-500/40 bg-amber-950/40 text-amber-400"
                            : exam.dificuldade === "Difícil"
                            ? "border-rose-500/40 bg-rose-950/40 text-rose-400"
                            : "border-gold-500/40 bg-gold-950/40 text-gold-400"
                        }`}
                      >
                        {exam.dificuldade}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-300">{exam.quantidade_questoes}</td>
                    <td className="px-4 py-4 font-medium text-slate-300">
                      {new Date(exam.created_at).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Visualizar */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenPreview(exam)}
                          aria-label="Visualizar prova"
                          title="Visualizar prova"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Baixar PDF */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDownload(exam)}
                          isLoading={downloadingId === exam.id}
                          disabled={downloadingId !== null}
                          aria-label="Baixar PDF"
                          title="Baixar PDF novamente"
                        >
                          <Download className="h-4 w-4" />
                        </Button>

                        {/* Regerar */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRegenerate(exam)}
                          isLoading={regeneratingId === exam.id}
                          disabled={regeneratingId !== null}
                          aria-label="Regerar prova"
                          title="Regerar nova prova com mesmos parâmetros"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>

                        {/* Duplicar */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicate(exam)}
                          aria-label="Duplicar prova"
                          title="Duplicar parâmetros no formulário"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>

                        {/* Excluir */}
                        <Button
                          type="button"
                          variant="danger"
                          size="icon"
                          onClick={() => setDeletingExam(exam)}
                          aria-label="Excluir prova"
                          title="Excluir prova"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Paginação Real */}
          <div className="flex flex-col gap-3 border-t border-navy-700 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              Página {currentPage} de {totalPages} • Total: <strong className="text-slate-200">{data.total}</strong> prova(s)
            </p>
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="ghost"
                className="h-9 px-3 text-xs"
                disabled={currentPage <= 1}
                onClick={() => handleFilterChange({ page: currentPage - 1 })}
              >
                Anterior
              </Button>

              {pageNumbers.map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleFilterChange({ page: num })}
                  className={`h-9 w-9 rounded-xl text-xs font-bold transition ${
                    num === currentPage
                      ? "bg-gold-500 text-navy-950 font-black shadow-xs"
                      : "text-slate-400 hover:bg-navy-850 hover:text-slate-100"
                  }`}
                >
                  {num}
                </button>
              ))}

              <Button
                type="button"
                variant="ghost"
                className="h-9 px-3 text-xs"
                disabled={currentPage >= totalPages}
                onClick={() => handleFilterChange({ page: currentPage + 1 })}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pré-Visualização da Prova */}
      {previewExam && previewPayload && (
        <ExamPreviewModal
          isOpen={Boolean(previewExam)}
          onClose={() => {
            setPreviewExam(null);
            setPreviewPayload(null);
          }}
          exam={previewExam}
          dataPayload={previewPayload}
          onDownload={handleDownload}
          isDownloading={downloadingId === previewExam.id}
        />
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        isOpen={Boolean(deletingExam)}
        onClose={() => setDeletingExam(null)}
        title="Excluir Prova"
        description="Esta ação removerá o registro desta prova do histórico."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Tem certeza que deseja excluir a prova de{" "}
            <strong>{deletingExam?.disciplina}</strong> ({deletingExam?.assunto})? Essa ação não poderá ser desfeita.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeletingExam(null)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
            >
              Excluir definitivamente
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

