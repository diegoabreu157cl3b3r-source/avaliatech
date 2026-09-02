"use client";

import { useState } from "react";
import { Download, CheckCircle2, FileText, Layers, Calendar, School, User, Award } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import type { ExamDataPayload, Prova } from "@/types/exam";

interface ExamPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: Prova | null;
  dataPayload: ExamDataPayload | null;
  onDownload: (exam: Prova) => Promise<void>;
  isDownloading: boolean;
}

export function ExamPreviewModal({
  isOpen,
  onClose,
  exam,
  dataPayload,
  onDownload,
  isDownloading
}: ExamPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "versionA" | "versionB" | "answerKey">("info");

  if (!exam || !dataPayload) return null;

  const header = dataPayload.header;
  const versionA = dataPayload.versionA;
  const versionB = dataPayload.versionB;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Visualizar Prova: ${exam.disciplina}`}
      description={`Gerada em ${new Date(exam.created_at).toLocaleDateString("pt-BR")}`}
      size="xl"
    >
      <div className="space-y-5">
        {/* Abas de Navegação */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "info"
                ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Cabeçalho / Geral
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("versionA")}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "versionA"
                ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Prova Versão A ({versionA.questoes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("versionB")}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "versionB"
                ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Prova Versão B ({versionB.questoes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("answerKey")}
            className={`border-b-2 px-4 py-2.5 text-xs font-bold transition ${
              activeTab === "answerKey"
                ? "border-brand-600 text-brand-700 dark:border-brand-400 dark:text-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            Gabaritos A & B
          </button>
        </div>

        {/* Conteúdo da Aba */}
        <div className="max-h-[60vh] overflow-y-auto pr-1">
          {/* Aba Info */}
          {activeTab === "info" && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                  <span className="rounded-xl bg-brand-50 p-2 text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                    <School className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Escola</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{exam.escola}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                  <span className="rounded-xl bg-indigo-50 p-2 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    <User className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Professor</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{exam.professor}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                  <span className="rounded-xl bg-emerald-50 p-2 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                    <Layers className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Disciplina</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">{exam.disciplina}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                  <span className="rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                    <Calendar className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Data da Prova</p>
                    <p className="font-bold text-slate-900 dark:text-slate-100">
                      {exam.data_prova ? new Date(exam.data_prova).toLocaleDateString("pt-BR") : "Não informada"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assuntos da avaliação</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {exam.assunto.split(",").map((item, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {item.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Dificuldade</p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">{exam.dificuldade}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Total de Questões</p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">{exam.quantidade_questoes} itens</p>
                </div>
                <div className="rounded-2xl border border-slate-200 p-3.5 dark:border-slate-800 dark:bg-slate-800/30">
                  <p className="text-xs text-slate-400 dark:text-slate-500">Valor da Prova</p>
                  <p className="mt-1 font-bold text-slate-900 dark:text-slate-100">{exam.valor_avaliacao || "10,0"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Aba Versão A */}
          {activeTab === "versionA" && (
            <div className="space-y-4">
              {versionA.questoes.map((item, idx) => (
                <article key={idx} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-brand-600 dark:text-brand-400">Questão {idx + 1}.</span> {item.pergunta}
                    </p>
                    <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.dificuldade}
                    </span>
                  </div>

                  {item.imagem && (
                    <div className="my-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imagem} alt="Imagem da questão" className="max-h-40 rounded-xl object-contain" />
                    </div>
                  )}

                  <div className="mt-3 space-y-1.5">
                    {item.alternativas.map((alt) => (
                      <div
                        key={alt.letra}
                        className={`flex items-start gap-2 rounded-xl p-2 text-xs transition ${
                          alt.letra === item.corretaFinal
                            ? "bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="font-bold">{alt.letra})</span>
                        <span>{alt.texto}</span>
                        {alt.letra === item.corretaFinal && (
                          <span className="ml-auto text-[10px] text-emerald-700 dark:text-emerald-400">
                            (Correta)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Aba Versão B */}
          {activeTab === "versionB" && (
            <div className="space-y-4">
              {versionB.questoes.map((item, idx) => (
                <article key={idx} className="rounded-2xl border border-slate-200 p-4 dark:border-slate-800 dark:bg-slate-800/30">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      <span className="text-indigo-600 dark:text-indigo-400">Questão {idx + 1}.</span> {item.pergunta}
                    </p>
                    <span className="shrink-0 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.dificuldade}
                    </span>
                  </div>

                  {item.imagem && (
                    <div className="my-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.imagem} alt="Imagem da questão" className="max-h-40 rounded-xl object-contain" />
                    </div>
                  )}

                  <div className="mt-3 space-y-1.5">
                    {item.alternativas.map((alt) => (
                      <div
                        key={alt.letra}
                        className={`flex items-start gap-2 rounded-xl p-2 text-xs transition ${
                          alt.letra === item.corretaFinal
                            ? "bg-emerald-50 font-bold text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800"
                            : "text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <span className="font-bold">{alt.letra})</span>
                        <span>{alt.texto}</span>
                        {alt.letra === item.corretaFinal && (
                          <span className="ml-auto text-[10px] text-emerald-700 dark:text-emerald-400">
                            (Correta)
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Aba Gabaritos A & B */}
          {activeTab === "answerKey" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 dark:border-brand-900/60 dark:bg-brand-950/20">
                <h3 className="text-sm font-black text-brand-800 dark:text-brand-300">
                  Gabarito — Versão A
                </h3>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {versionA.questoes.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center rounded-xl bg-white p-2 shadow-xs dark:bg-slate-800"
                    >
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Q{idx + 1}</span>
                      <strong className="text-base font-black text-brand-700 dark:text-brand-400">
                        {item.corretaFinal}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4 dark:border-indigo-900/60 dark:bg-indigo-950/20">
                <h3 className="text-sm font-black text-indigo-800 dark:text-indigo-300">
                  Gabarito — Versão B
                </h3>
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {versionB.questoes.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-center rounded-xl bg-white p-2 shadow-xs dark:bg-slate-800"
                    >
                      <span className="text-[10px] text-slate-400 dark:text-slate-500">Q{idx + 1}</span>
                      <strong className="text-base font-black text-indigo-700 dark:text-indigo-400">
                        {item.corretaFinal}
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé da Modal */}
        <div className="flex flex-col-reverse justify-end gap-2 sm:flex-row">
          <Button type="button" variant="ghost" onClick={onClose}>
            Fechar
          </Button>
          <Button
            type="button"
            className="gap-2"
            onClick={() => onDownload(exam)}
            isLoading={isDownloading}
          >
            <Download className="h-4 w-4" /> Baixar PDF Completo
          </Button>
        </div>
      </div>
    </Modal>
  );
}
