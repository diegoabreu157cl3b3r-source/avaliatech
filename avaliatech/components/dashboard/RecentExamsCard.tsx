"use client";

import Link from "next/link";
import { FileText, Download, ArrowRight, PlusCircle, Layers } from "lucide-react";
import { useState } from "react";
import { downloadHistoricalExamPdf } from "@/services/exam-service";
import { useToast } from "@/hooks/useToast";
import type { Prova } from "@/types/exam";
import { EmptyExamsIllustration } from "./DashboardIllustrations";

interface RecentExamsCardProps {
  exams: Prova[];
  isLoading: boolean;
}

export function RecentExamsCard({ exams, isLoading }: RecentExamsCardProps) {
  const { showToast } = useToast();
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  async function handleDownload(exam: Prova, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
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
    <div className="rounded-2xl border border-navy-750 bg-navy-900 p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-750/70 mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-navy-850 border border-navy-700 text-gold-400">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-100">Minhas provas</h3>
            <p className="text-[11px] text-slate-400">Acesse suas avaliações criadas recentemente.</p>
          </div>
        </div>
        <Link
          href="/provas"
          className="text-xs font-semibold text-gold-400 hover:text-gold-300 inline-flex items-center gap-1 transition"
        >
          Ver todas <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3 py-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl bg-navy-850/60 animate-pulse" />
          ))}
        </div>
      ) : exams.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <EmptyExamsIllustration className="h-16 w-16 mb-2" />
          <p className="text-xs font-semibold text-slate-200">Nenhuma avaliação gerada ainda</p>
          <p className="mt-0.5 text-[11px] text-slate-400 max-w-xs">
            Crie sua primeira prova com versões A/B organizadas e gabarito automático.
          </p>
          <Link
            href="/gerar-prova"
            className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-gold-500 px-3.5 py-1.5 text-xs font-bold text-white dark:text-navy-950 transition hover:bg-gold-400 active:scale-95"
          >
            <PlusCircle className="h-3.5 w-3.5" /> Gerar primeira prova
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {exams.slice(0, 3).map((exam) => (
            <div
              key={exam.id}
              className="group flex items-center justify-between gap-3 rounded-xl border border-navy-750/70 bg-navy-850/40 p-3 transition hover:bg-navy-850 hover:border-gold-500/30"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy-900 border border-navy-700 text-slate-400 group-hover:text-gold-400 transition">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-xs font-bold text-slate-100 group-hover:text-gold-400 transition">
                    {exam.disciplina} {exam.assunto ? `— ${exam.assunto}` : ""}
                  </h4>
                  <p className="truncate text-[11px] text-slate-400">
                    {exam.escola || "AvaliaTech"} &bull; {exam.quantidade_questoes} questões &bull;{" "}
                    {new Date(exam.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              {/* Actions on right */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="rounded-md bg-navy-900 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-navy-700">
                  A/B
                </span>
                <button
                  type="button"
                  onClick={(e) => handleDownload(exam, e)}
                  disabled={downloadingId === exam.id}
                  className="inline-flex items-center gap-1 rounded-lg bg-navy-900 px-2.5 py-1 text-xs font-semibold text-slate-200 border border-navy-700 transition hover:bg-gold-500 hover:text-white dark:hover:text-navy-950 hover:border-gold-500 active:scale-95 disabled:opacity-50"
                  title="Baixar PDF da prova"
                >
                  <Download className="h-3 w-3" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

