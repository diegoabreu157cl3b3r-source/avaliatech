"use client";

import { CheckCircle2, BookOpen, Tag, HelpCircle, Image as ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { DifficultyBadge } from "@/components/ui/DifficultyBadge";
import type { Questao } from "@/types/question";

interface QuestionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Questao | null;
}

export function QuestionViewModal({ isOpen, onClose, question }: QuestionViewModalProps) {
  if (!question) return null;

  const alternativas = [
    { key: "A" as const, text: question.alternativa_a },
    { key: "B" as const, text: question.alternativa_b },
    { key: "C" as const, text: question.alternativa_c },
    { key: "D" as const, text: question.alternativa_d }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalhes da Questão"
      description={`Cadastrada em ${new Date(question.created_at).toLocaleDateString("pt-BR")}`}
      size="lg"
    >
      <div className="space-y-5">
        {/* Metadados da Questão (Disciplina, Assunto, Dificuldade) */}
        <div className="flex flex-wrap items-center gap-2.5 rounded-2xl bg-navy-850 p-3.5 border border-navy-750 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-100">
            <BookOpen className="h-3.5 w-3.5 text-gold-400" />
            <span>{question.disciplina}</span>
          </div>

          <span className="text-slate-400">•</span>

          <div className="flex items-center gap-1.5 font-medium text-slate-300">
            <Tag className="h-3.5 w-3.5 text-sky-400" />
            <span>{question.assunto}</span>
          </div>

          <span className="text-slate-400">•</span>

          <DifficultyBadge difficulty={question.dificuldade} />
        </div>

        {/* Imagem da questão se houver */}
        {question.imagem && (
          <div className="overflow-hidden rounded-2xl border border-navy-750 bg-navy-950/60 p-3 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mb-2">
              <ImageIcon className="h-3.5 w-3.5" />
              <span>Imagem de apoio da questão</span>
            </div>
            <img
              src={question.imagem}
              alt="Imagem da questão"
              className="max-h-80 mx-auto rounded-xl border border-navy-700 object-contain shadow-sm"
            />
          </div>
        )}

        {/* Enunciado da Pergunta */}
        <div className="rounded-2xl border border-navy-750 bg-navy-850/60 p-4">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-gold-400">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Enunciado</span>
          </div>
          <p className="text-sm font-semibold text-slate-100 leading-relaxed whitespace-pre-wrap">
            {question.pergunta}
          </p>
        </div>

        {/* Alternativas */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Alternativas
          </h4>
          <div className="space-y-2">
            {alternativas.map((alt) => {
              const isCorreta = question.correta === alt.key;
              return (
                <div
                  key={alt.key}
                  className={`flex items-start gap-3 rounded-xl border p-3.5 transition text-xs sm:text-sm ${
                    isCorreta
                      ? "border-emerald-500/50 bg-emerald-950/20 text-slate-100 dark:bg-emerald-950/40"
                      : "border-navy-750 bg-navy-850/40 text-slate-300"
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-black ${
                      isCorreta
                        ? "bg-emerald-500 text-white dark:text-navy-950"
                        : "bg-navy-800 text-slate-400 border border-navy-700"
                    }`}
                  >
                    {alt.key}
                  </span>
                  <div className="flex-1 pt-0.5 leading-relaxed whitespace-pre-wrap">
                    {alt.text}
                  </div>
                  {isCorreta && (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-md bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="h-3 w-3" /> Correta
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé informativo */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-navy-700 bg-navy-850 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-navy-800 hover:text-white transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}

