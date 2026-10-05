"use client";

import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Edit2,
  FolderPlus,
  Layers,
  Plus,
  PlusCircle,
  Search,
  Tag,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import {
  createDiscipline,
  createSubject,
  deleteDiscipline,
  deleteSubject,
  getDisciplines,
  updateDiscipline,
  updateSubject
} from "@/services/discipline-service";
import type { Assunto, DisciplinaWithAssuntos } from "@/types/discipline";

export default function DisciplinasPage() {
  const { toast, showToast } = useToast();
  const [disciplines, setDisciplines] = useState<DisciplinaWithAssuntos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // Modal states - Disciplina
  const [isDisciplineModalOpen, setIsDisciplineModalOpen] = useState(false);
  const [editingDiscipline, setEditingDiscipline] = useState<DisciplinaWithAssuntos | null>(null);
  const [disciplineName, setDisciplineName] = useState("");
  const [isSavingDiscipline, setIsSavingDiscipline] = useState(false);

  // Modal states - Assunto
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [targetDisciplineForSubject, setTargetDisciplineForSubject] = useState<DisciplinaWithAssuntos | null>(null);
  const [editingSubject, setEditingSubject] = useState<Assunto | null>(null);
  const [subjectName, setSubjectName] = useState("");
  const [isSavingSubject, setIsSavingSubject] = useState(false);

  // Modal states - Delete Confirmation
  const [deletingItem, setDeletingItem] = useState<{
    type: "discipline" | "subject";
    disciplineId: number;
    subjectId?: number;
    name: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getDisciplines();
      if (res.data) {
        setDisciplines(res.data);
        // Expand all by default
        setExpandedIds(new Set(res.data.map((d) => d.id)));
      }
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao carregar disciplinas.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function toggleExpand(id: number) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  // --- Handlers Disciplina ---
  function openCreateDisciplineModal() {
    setEditingDiscipline(null);
    setDisciplineName("");
    setIsDisciplineModalOpen(true);
  }

  function openEditDisciplineModal(disc: DisciplinaWithAssuntos) {
    setEditingDiscipline(disc);
    setDisciplineName(disc.nome);
    setIsDisciplineModalOpen(true);
  }

  async function handleSaveDiscipline(e: React.FormEvent) {
    e.preventDefault();
    if (!disciplineName.trim()) {
      showToast("O nome da disciplina é obrigatório.", "error");
      return;
    }

    setIsSavingDiscipline(true);
    try {
      if (editingDiscipline) {
        await updateDiscipline(editingDiscipline.id, { nome: disciplineName.trim() });
        showToast("Disciplina atualizada com sucesso.", "success");
      } else {
        await createDiscipline({ nome: disciplineName.trim() });
        showToast("Disciplina cadastrada com sucesso.", "success");
      }
      setIsDisciplineModalOpen(false);
      setDisciplineName("");
      await loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao salvar disciplina.", "error");
    } finally {
      setIsSavingDiscipline(false);
    }
  }

  // --- Handlers Assunto ---
  function openCreateSubjectModal(disc: DisciplinaWithAssuntos) {
    setTargetDisciplineForSubject(disc);
    setEditingSubject(null);
    setSubjectName("");
    setIsSubjectModalOpen(true);
  }

  function openEditSubjectModal(disc: DisciplinaWithAssuntos, subject: Assunto) {
    setTargetDisciplineForSubject(disc);
    setEditingSubject(subject);
    setSubjectName(subject.nome);
    setIsSubjectModalOpen(true);
  }

  async function handleSaveSubject(e: React.FormEvent) {
    e.preventDefault();
    if (!targetDisciplineForSubject) return;
    if (!subjectName.trim()) {
      showToast("O nome do assunto é obrigatório.", "error");
      return;
    }

    setIsSavingSubject(true);
    try {
      if (editingSubject) {
        await updateSubject(targetDisciplineForSubject.id, editingSubject.id, {
          nome: subjectName.trim()
        });
        showToast("Assunto atualizado com sucesso.", "success");
      } else {
        await createSubject(targetDisciplineForSubject.id, {
          nome: subjectName.trim()
        });
        showToast("Assunto cadastrado com sucesso.", "success");
      }
      setIsSubjectModalOpen(false);
      setSubjectName("");
      await loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao salvar assunto.", "error");
    } finally {
      setIsSavingSubject(false);
    }
  }

  // --- Handlers Exclusão ---
  async function handleConfirmDelete() {
    if (!deletingItem) return;
    setIsDeleting(true);
    try {
      if (deletingItem.type === "discipline") {
        await deleteDiscipline(deletingItem.disciplineId);
        showToast("Disciplina excluída com sucesso.", "success");
      } else if (deletingItem.subjectId) {
        await deleteSubject(deletingItem.disciplineId, deletingItem.subjectId);
        showToast("Assunto excluído com sucesso.", "success");
      }
      setDeletingItem(null);
      await loadData();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao excluir.", "error");
    } finally {
      setIsDeleting(false);
    }
  }

  // Filtering
  const filteredDisciplines = disciplines.filter((d) => {
    const matchesDisc = d.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubj = d.assuntos.some((s) =>
      s.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesDisc || matchesSubj;
  });

  const totalAssuntos = disciplines.reduce((acc, d) => acc + (d.assuntos?.length || 0), 0);
  const totalQuestoes = disciplines.reduce((acc, d) => acc + (d.total_questoes || 0), 0);

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}

      {/* Header */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
            Disciplinas e Assuntos
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Cadastre e gerencie a estrutura curricular de disciplinas e tópicos das suas avaliações.
          </p>
        </div>
        <Button
          type="button"
          onClick={openCreateDisciplineModal}
          className="gap-2 text-xs font-semibold self-start sm:self-auto"
        >
          <PlusCircle className="h-4 w-4" /> Nova disciplina
        </Button>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3.5 rounded-2xl border border-navy-800 bg-navy-900/60 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-700 bg-navy-850 text-gold-400">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Disciplinas</p>
            <p className="text-lg font-bold text-slate-100">{disciplines.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-navy-800 bg-navy-900/60 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-700 bg-navy-850 text-sky-400">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Assuntos Cadastrados</p>
            <p className="text-lg font-bold text-slate-100">{totalAssuntos}</p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 rounded-2xl border border-navy-800 bg-navy-900/60 p-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-navy-700 bg-navy-850 text-emerald-400">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400">Questões Vinculadas</p>
            <p className="text-lg font-bold text-slate-100">{totalQuestoes}</p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="card p-3.5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar por disciplina ou assunto..."
            className="w-full rounded-xl border border-navy-750 bg-navy-950/60 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-100 placeholder-slate-400 outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/20 transition"
          />
        </div>
      </div>

      {/* Disciplines List */}
      {isLoading ? (
        <Skeleton className="h-72" />
      ) : disciplines.length === 0 ? (
        <EmptyState
          title="Nenhuma disciplina cadastrada"
          description="Comece cadastrando sua primeira matéria para depois vincular assuntos e criar questões organizadas."
        />
      ) : filteredDisciplines.length === 0 ? (
        <EmptyState
          title="Nenhum resultado encontrado"
          description="Nenhuma disciplina ou assunto corresponde ao termo pesquisado."
        />
      ) : (
        <div className="space-y-4">
          {filteredDisciplines.map((disc) => {
            const isExpanded = expandedIds.has(disc.id);
            const subjects = disc.assuntos || [];

            return (
              <div
                key={disc.id}
                className="overflow-hidden rounded-2xl border border-navy-800 bg-navy-900/70 transition shadow-xs hover:border-navy-700"
              >
                {/* Header da Disciplina */}
                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between bg-navy-850/40 border-b border-navy-800/80">
                  <div
                    onClick={() => toggleExpand(disc.id)}
                    className="flex cursor-pointer items-center gap-3 select-none flex-1"
                  >
                    <button
                      type="button"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-navy-700 bg-navy-800 text-slate-300 hover:text-slate-100"
                      aria-label="Expandir ou recolher"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gold-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-gold-400" />
                        <h2 className="text-base font-bold text-slate-100">{disc.nome}</h2>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {subjects.length} {subjects.length === 1 ? "assunto" : "assuntos"} &bull;{" "}
                        {disc.total_questoes || 0}{" "}
                        {disc.total_questoes === 1 ? "questão vinculada" : "questões vinculadas"}
                      </p>
                    </div>
                  </div>

                  {/* Ações da Disciplina */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openCreateSubjectModal(disc)}
                      className="gap-1.5 text-xs text-gold-400 hover:bg-gold-500/10"
                    >
                      <Plus className="h-3.5 w-3.5" /> Adicionar assunto
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditDisciplineModal(disc)}
                      title="Editar disciplina"
                      aria-label="Editar disciplina"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-slate-300" />
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      size="icon"
                      onClick={() =>
                        setDeletingItem({
                          type: "discipline",
                          disciplineId: disc.id,
                          name: disc.nome
                        })
                      }
                      title="Excluir disciplina"
                      aria-label="Excluir disciplina"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Lista de Assuntos (Accordion Body) */}
                {isExpanded && (
                  <div className="p-4">
                    {subjects.length === 0 ? (
                      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-navy-800 bg-navy-950/40 p-6 text-center">
                        <Tag className="h-6 w-6 text-slate-500 mb-2" />
                        <p className="text-xs font-semibold text-slate-300">
                          Nenhum assunto cadastrado nesta disciplina.
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Assuntos representam tópicos como &ldquo;Equações&rdquo;, &ldquo;Geometria&rdquo;, etc.
                        </p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openCreateSubjectModal(disc)}
                          className="mt-3 gap-1.5 text-xs text-gold-400"
                        >
                          <Plus className="h-3.5 w-3.5" /> Cadastrar primeiro assunto
                        </Button>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {subjects.map((subject) => (
                          <div
                            key={subject.id}
                            className="flex items-center justify-between rounded-xl border border-navy-750 bg-navy-850/60 p-3 transition hover:border-navy-700 hover:bg-navy-850"
                          >
                            <div className="flex items-center gap-2 overflow-hidden pr-2">
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-navy-800 text-sky-400">
                                <Tag className="h-3 w-3" />
                              </span>
                              <div className="truncate">
                                <p className="truncate text-xs font-semibold text-slate-200">
                                  {subject.nome}
                                </p>
                                <p className="text-[10px] text-slate-400">
                                  {subject.total_questoes || 0}{" "}
                                  {subject.total_questoes === 1 ? "questão" : "questões"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => openEditSubjectModal(disc, subject)}
                                className="rounded p-1 text-slate-400 hover:text-slate-200 transition"
                                title="Editar assunto"
                                aria-label="Editar assunto"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setDeletingItem({
                                    type: "subject",
                                    disciplineId: disc.id,
                                    subjectId: subject.id,
                                    name: subject.nome
                                  })
                                }
                                className="rounded p-1 text-slate-400 hover:text-rose-400 transition"
                                title="Excluir assunto"
                                aria-label="Excluir assunto"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Criar / Editar Disciplina */}
      <Modal
        isOpen={isDisciplineModalOpen}
        onClose={() => setIsDisciplineModalOpen(false)}
        title={editingDiscipline ? "Editar Disciplina" : "Nova Disciplina"}
        description="Exemplos: Matemática, História, Física, Biologia..."
      >
        <form onSubmit={handleSaveDiscipline} className="space-y-4">
          <Input
            label="Nome da Disciplina"
            value={disciplineName}
            onChange={(e) => setDisciplineName(e.target.value)}
            placeholder="Ex.: Matemática"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-navy-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsDisciplineModalOpen(false)}
              disabled={isSavingDiscipline}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSavingDiscipline}>
              {editingDiscipline ? "Salvar alterações" : "Cadastrar disciplina"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Criar / Editar Assunto */}
      <Modal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        title={
          editingSubject
            ? `Editar Assunto (${targetDisciplineForSubject?.nome})`
            : `Novo Assunto em ${targetDisciplineForSubject?.nome}`
        }
        description="Exemplos: Equações do 2º grau, Brasil Colônia, Cinemática..."
      >
        <form onSubmit={handleSaveSubject} className="space-y-4">
          <Input
            label="Nome do Assunto / Tópico"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            placeholder="Ex.: Geometria Espacial"
            required
            autoFocus
          />
          <div className="flex justify-end gap-2 pt-2 border-t border-navy-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsSubjectModalOpen(false)}
              disabled={isSavingSubject}
            >
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSavingSubject}>
              {editingSubject ? "Salvar alterações" : "Cadastrar assunto"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal Confirmação de Exclusão */}
      <Modal
        isOpen={Boolean(deletingItem)}
        onClose={() => setDeletingItem(null)}
        title={
          deletingItem?.type === "discipline"
            ? "Excluir Disciplina"
            : "Excluir Assunto"
        }
        description="Esta ação não poderá ser desfeita."
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300 leading-relaxed">
            Tem certeza que deseja excluir{" "}
            {deletingItem?.type === "discipline" ? "a disciplina" : "o assunto"}{" "}
            <strong className="text-slate-100 font-bold">{deletingItem?.name}</strong>?
          </p>

          <div className="flex items-start gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
            <span>
              Caso existam questões vinculadas a este registro, o sistema impedirá a exclusão para preservar a integridade do seu banco.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-navy-800">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeletingItem(null)}
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

