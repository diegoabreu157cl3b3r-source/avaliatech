"use client";

import { PlusCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { QuestionFilters } from "@/components/questions/QuestionFilters";
import { QuestionForm } from "@/components/questions/QuestionForm";
import { QuestionTable } from "@/components/questions/QuestionTable";
import { useToast } from "@/hooks/useToast";
import { createQuestion, deleteQuestion, listQuestions, updateQuestion } from "@/services/question-service";
import type { PaginatedResponse } from "@/types/api";
import type { Questao, QuestaoFilters, QuestaoFormData } from "@/types/question";

export default function QuestoesPage() {
  const { toast, showToast } = useToast();
  const [filters, setFilters] = useState<QuestaoFilters>({ page: 1, limit: 10 });
  const [data, setData] = useState<PaginatedResponse<Questao> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Questao | null>(null);

  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await listQuestions(filters);
      setData(response.data ?? null);
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao carregar questões.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [filters, showToast]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  function openCreateModal() {
    setEditingQuestion(null);
    setModalOpen(true);
  }

  function openEditModal(question: Questao) {
    setEditingQuestion(question);
    setModalOpen(true);
  }

  async function handleSave(form: QuestaoFormData) {
    if (editingQuestion) {
      await updateQuestion(editingQuestion.id, form);
      showToast("Questão atualizada com sucesso.", "success");
    } else {
      await createQuestion(form);
      showToast("Questão cadastrada com sucesso.", "success");
    }

    setModalOpen(false);
    setEditingQuestion(null);
    await loadQuestions();
  }

  async function handleDelete(question: Questao) {
    const confirmed = window.confirm(`Deseja excluir a questão ${question.id}?`);
    if (!confirmed) return;

    try {
      await deleteQuestion(question.id);
      showToast("Questão excluída com sucesso.", "success");
      await loadQuestions();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao excluir questão.", "error");
    }
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <section className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Banco de questões</p>
          <h1 className="mt-1 text-2xl font-black text-slate-900">Questões</h1>
          <p className="mt-2 text-sm text-slate-500">Cadastre, filtre, edite e exclua apenas as suas questões.</p>
        </div>
        <Button type="button" onClick={openCreateModal} className="gap-2">
          <PlusCircle className="h-4 w-4" /> Nova questão
        </Button>
      </section>

      <QuestionFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ page: 1, limit: 10 })}
      />

      {isLoading ? <Skeleton className="h-96" /> : (
        <QuestionTable
          data={data}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
        />
      )}

      <Modal
        title={editingQuestion ? "Editar questão" : "Cadastrar questão"}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      >
        <QuestionForm
          key={editingQuestion?.id ?? "new"}
          initialData={editingQuestion}
          onSubmit={handleSave}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
