"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { PaginatedResponse } from "@/types/api";
import type { Questao } from "@/types/question";

interface QuestionTableProps {
  data: PaginatedResponse<Questao> | null;
  onEdit: (question: Questao) => void;
  onDelete: (question: Questao) => void;
  onPageChange: (page: number) => void;
}

export function QuestionTable({ data, onEdit, onDelete, onPageChange }: QuestionTableProps) {
  if (!data || data.items.length === 0) {
    return <EmptyState title="Nenhuma questão encontrada" description="Cadastre uma nova questão ou ajuste os filtros utilizados." />;
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="border-b border-navy-700 bg-navy-850 text-xs font-bold uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3.5">Imagem</th>
              <th className="px-4 py-3.5">Pergunta</th>
              <th className="px-4 py-3.5">Disciplina</th>
              <th className="px-4 py-3.5">Assunto</th>
              <th className="px-4 py-3.5">Dificuldade</th>
              <th className="px-4 py-3.5">Correta</th>
              <th className="px-4 py-3.5 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {data.items.map((question) => (
              <tr key={question.id} className="bg-navy-900 align-top transition hover:bg-navy-850">
                <td className="px-4 py-4">
                  {question.imagem ? (
                    <img src={question.imagem} alt="Imagem da questão" className="h-12 w-16 rounded-lg border border-navy-700 object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400">Sem imagem</span>
                  )}
                </td>
                <td className="max-w-sm px-4 py-4 font-semibold text-slate-100">{question.pergunta}</td>
                <td className="px-4 py-4 font-medium text-slate-300">{question.disciplina}</td>
                <td className="px-4 py-4 font-semibold text-slate-100">{question.assunto}</td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full border px-3 py-0.5 text-xs font-bold ${
                      question.dificuldade === "Fácil"
                        ? "border-emerald-500/40 bg-emerald-950/40 text-emerald-400"
                        : question.dificuldade === "Média"
                        ? "border-amber-500/40 bg-amber-950/40 text-amber-400"
                        : "border-rose-500/40 bg-rose-950/40 text-rose-400"
                    }`}
                  >
                    {question.dificuldade}
                  </span>
                </td>
                <td className="px-4 py-4 font-black text-gold-400">{question.correta}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-1.5">
                    <Button type="button" variant="ghost" size="icon" onClick={() => onEdit(question)} aria-label="Editar questão">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="danger" size="icon" onClick={() => onDelete(question)} aria-label="Excluir questão">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-navy-700 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-400">Página {data.page} de {data.totalPages} • Total: <strong className="text-slate-200">{data.total}</strong> questão(ões)</p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" disabled={data.page <= 1} onClick={() => onPageChange(data.page - 1)}>Anterior</Button>
          <Button type="button" variant="ghost" disabled={data.page >= data.totalPages} onClick={() => onPageChange(data.page + 1)}>Próxima</Button>
        </div>
      </div>
    </div>
  );
}
