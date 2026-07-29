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
          <thead className="bg-slate-100 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Pergunta</th>
              <th className="px-4 py-3">Disciplina</th>
              <th className="px-4 py-3">Assunto</th>
              <th className="px-4 py-3">Dificuldade</th>
              <th className="px-4 py-3">Correta</th>
              <th className="px-4 py-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {data.items.map((question) => (
              <tr key={question.id} className="bg-white align-top hover:bg-slate-50">
                <td className="max-w-sm px-4 py-4 font-semibold text-slate-900">{question.pergunta}</td>
                <td className="px-4 py-4 text-slate-600">{question.disciplina}</td>
                <td className="px-4 py-4 text-slate-600">{question.assunto}</td>
                <td className="px-4 py-4"><span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">{question.dificuldade}</span></td>
                <td className="px-4 py-4 font-black text-slate-900">{question.correta}</td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" className="h-10 w-10 p-0" onClick={() => onEdit(question)} aria-label="Editar questão">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="danger" className="h-10 w-10 p-0" onClick={() => onDelete(question)} aria-label="Excluir questão">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Página {data.page} de {data.totalPages} • {data.total} registro(s)</p>
        <div className="flex gap-2">
          <Button type="button" variant="ghost" disabled={data.page <= 1} onClick={() => onPageChange(data.page - 1)}>Anterior</Button>
          <Button type="button" variant="ghost" disabled={data.page >= data.totalPages} onClick={() => onPageChange(data.page + 1)}>Próxima</Button>
        </div>
      </div>
    </div>
  );
}
