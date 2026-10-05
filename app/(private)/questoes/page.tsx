"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bot, PlusCircle } from "lucide-react";
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

// Lazy load heavy components
const QuestionViewModal = dynamic(
  () => import("@/components/questions/QuestionViewModal").then((mod) => mod.QuestionViewModal),
  { ssr: false }
);

const AIGenerateQuestions = dynamic(
  () => import("@/components/questions/AIGenerateQuestions").then((mod) => mod.AIGenerateQuestions),
  { ssr: false }
);

export default function QuestoesPage() {
  const { toast, showToast } = useToast();
  const [filters, setFilters] = useState<QuestaoFilters>({ page: 1, limit: 10 });
  const [data, setData] = useState<PaginatedResponse<Questao> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Questao | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Questao | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  const loadQuestions = useCallback(async () => {
    // Cancel previous inflight request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (!data) setIsLoading(true);
    else setIsUpdating(true);

    try {
      const response = await listQuestions(filters, controller.signal);
      setData(response.data ?? null);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return; // Request was aborted by a newer filter change
      }
      showToast(error instanceof Error ? error.message : "Erro ao carregar questões.", "error");
    } finally {
      if (abortControllerRef.current === controller) {
        setIsLoading(false);
        setIsUpdating(false);
        abortControllerRef.current = null;
      }
    }
  }, [data, filters, showToast]);

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
      const res = await updateQuestion(editingQuestion.id, form);
      const updatedItem = res.data;
      if (updatedItem && data) {
        setData({
          ...data,
          items: data.items.map((item) => (item.id === editingQuestion.id ? updatedItem : item))
        });
      }
      showToast("Questão atualizada com sucesso.", "success");
    } else {
      const res = await createQuestion(form);
      const createdItem = res.data;
      if (createdItem && data && (filters.page ?? 1) === 1) {
        setData({
          ...data,
          items: [createdItem, ...data.items.slice(0, (filters.limit ?? 10) - 1)],
          total: data.total + 1
        });
      } else {
        await loadQuestions();
      }
      showToast("Questão cadastrada com sucesso.", "success");
    }

    setModalOpen(false);
    setEditingQuestion(null);
  }

  async function handleDelete(question: Questao) {
    const confirmed = window.confirm(`Deseja excluir a questão ${question.id}?`);
    if (!confirmed) return;

    // Optimistic delete
    const previousData = data;
    if (data) {
      setData({
        ...data,
        items: data.items.filter((item) => item.id !== question.id),
        total: Math.max(0, data.total - 1)
      });
    }

    try {
      await deleteQuestion(question.id);
      showToast("Questão excluída com sucesso.", "success");
    } catch (error) {
      // Rollback on failure
      setData(previousData);
      showToast(error instanceof Error ? error.message : "Erro ao excluir questão.", "error");
    }
  }

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Questões</h1>
          <p className="mt-1 text-sm text-slate-400">Cadastre, filtre, edite e gerencie o seu banco de itens.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="secondary" onClick={() => setAiModalOpen(true)} className="gap-2 text-xs">
            <Bot className="h-4 w-4 text-gold-400" /> Gerar com IA
          </Button>
          <Button type="button" onClick={openCreateModal} className="gap-2 text-xs">
            <PlusCircle className="h-4 w-4" /> Nova questão
          </Button>
        </div>
      </section>

      <QuestionFilters
        filters={filters}
        onChange={setFilters}
        onClear={() => setFilters({ page: 1, limit: 10 })}
      />

      {isLoading && !data ? (
        <Skeleton className="h-96" />
      ) : (
        <div className={`transition-opacity duration-200 ${isUpdating ? "opacity-60" : "opacity-100"}`}>
          <QuestionTable
            data={data}
            onView={(question) => setViewingQuestion(question)}
            onEdit={openEditModal}
            onDelete={handleDelete}
            onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
          />
        </div>
      )}

      {viewingQuestion && (
        <QuestionViewModal
          isOpen={Boolean(viewingQuestion)}
          question={viewingQuestion}
          onClose={() => setViewingQuestion(null)}
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

      {aiModalOpen && (
        <Modal title="Gerar questões com IA" isOpen={aiModalOpen} onClose={() => setAiModalOpen(false)}>
          <AIGenerateQuestions onSaved={loadQuestions} onClose={() => setAiModalOpen(false)} notify={showToast} />
        </Modal>
      )}
    </div>
  );
}
