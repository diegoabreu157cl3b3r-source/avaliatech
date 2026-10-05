"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AlertCircle, BookOpen, ExternalLink, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Combobox } from "@/components/ui/Combobox";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { CORRETAS, DIFICULDADES } from "@/lib/constants";
import { getDisciplines } from "@/services/discipline-service";
import { uploadQuestionImage } from "@/services/question-service";
import type { DisciplinaWithAssuntos } from "@/types/discipline";
import type { Questao, QuestaoFormData } from "@/types/question";

const emptyForm: QuestaoFormData = {
  pergunta: "",
  imagem: null,
  alternativa_a: "",
  alternativa_b: "",
  alternativa_c: "",
  alternativa_d: "",
  correta: "A",
  disciplina: "",
  assunto: "",
  dificuldade: "Fácil"
};

interface QuestionFormProps {
  initialData?: Questao | null;
  onSubmit: (data: QuestaoFormData) => Promise<void>;
  onCancel?: () => void;
}

export function QuestionForm({ initialData, onSubmit, onCancel }: QuestionFormProps) {
  const [form, setForm] = useState<QuestaoFormData>(
    initialData
      ? {
          pergunta: initialData.pergunta,
          imagem: initialData.imagem,
          alternativa_a: initialData.alternativa_a,
          alternativa_b: initialData.alternativa_b,
          alternativa_c: initialData.alternativa_c,
          alternativa_d: initialData.alternativa_d,
          correta: initialData.correta,
          disciplina: initialData.disciplina,
          assunto: initialData.assunto,
          dificuldade: initialData.dificuldade
        }
      : emptyForm
  );

  const [disciplines, setDisciplines] = useState<DisciplinaWithAssuntos[]>([]);
  const [isLoadingDisciplines, setIsLoadingDisciplines] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDisciplines() {
      try {
        const res = await getDisciplines();
        if (res.data) {
          setDisciplines(res.data);
        }
      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      } finally {
        setIsLoadingDisciplines(false);
      }
    }
    loadDisciplines();
  }, []);

  function update<K extends keyof QuestaoFormData>(key: K, value: QuestaoFormData[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleDisciplineChange(selectedDisciplineName: string) {
    setForm((current) => ({
      ...current,
      disciplina: selectedDisciplineName,
      assunto: current.disciplina === selectedDisciplineName ? current.assunto : ""
    }));
  }

  // Find subjects for current selected discipline
  const selectedDisciplineObj = disciplines.find(
    (d) => d.nome.toLowerCase() === form.disciplina.toLowerCase()
  );
  const availableSubjects = selectedDisciplineObj?.assuntos ?? [];

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setUploadError("Use uma imagem PNG, JPG, JPEG ou WebP de até 5 MB.");
      event.target.value = "";
      return;
    }
    setIsUploading(true);
    try {
      const imageUrl = await uploadQuestionImage(file);
      update("imagem", imageUrl);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Erro ao enviar imagem.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (!form.disciplina.trim()) {
      setFormError("Por favor, selecione uma disciplina.");
      return;
    }

    if (!form.assunto.trim()) {
      setFormError("Por favor, selecione um assunto.");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(form);
      if (!initialData) setForm(emptyForm);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Erro ao salvar questão.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      {/* Alerta caso não existam disciplinas cadastradas */}
      {!isLoadingDisciplines && disciplines.length === 0 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-400 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold text-amber-300">Nenhuma disciplina cadastrada</p>
            <p className="mt-1 text-slate-300">
              Para organizar melhor suas questões, cadastre primeiro as suas disciplinas e os respectivos assuntos.
            </p>
            <Link
              href="/disciplinas"
              target="_blank"
              className="mt-2.5 inline-flex items-center gap-1.5 font-bold text-gold-400 hover:text-gold-300 hover:underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Ir para Disciplinas e Assuntos</span>
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}

      {formError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">
          {formError}
        </div>
      )}

      {/* Enunciado da questão */}
      <Textarea
        label="Enunciado da Pergunta"
        rows={3}
        value={form.pergunta}
        onChange={(event) => update("pergunta", event.target.value)}
        placeholder="Digite o enunciado completo da questão..."
        required
      />

      {/* Imagem opcional */}
      <div className="rounded-2xl border border-dashed border-navy-700 bg-navy-950/60 p-4 transition">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-200">Imagem de apoio (opcional)</p>
            <p className="mt-1 text-xs text-slate-400">PNG, JPG, JPEG ou WebP, até 5 MB.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-navy-700 bg-navy-850 px-3.5 py-2 text-xs font-bold text-slate-200 transition hover:bg-navy-800 hover:border-gold-500/30">
            <ImagePlus className="h-4 w-4 text-gold-400" />
            {isUploading ? "Enviando..." : "Selecionar imagem"}
            <input
              className="sr-only"
              type="file"
              accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
              onChange={handleImageChange}
              disabled={isUploading}
            />
          </label>
        </div>
        {uploadError && <p className="mt-2 text-xs font-semibold text-rose-400">{uploadError}</p>}
        {form.imagem && (
          <div className="relative mt-4 overflow-hidden rounded-xl border border-navy-700 bg-navy-900 p-2">
            <img src={form.imagem} alt="Prévia da imagem da questão" className="max-h-72 w-full object-contain" />
            <Button
              type="button"
              variant="danger"
              size="icon"
              className="absolute right-3 top-3"
              onClick={() => update("imagem", null)}
              aria-label="Remover imagem"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Alternativas com Textarea confortável para textos longos */}
      <div className="space-y-3">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
          Alternativas de Resposta
        </label>
        <div className="grid gap-3.5 sm:grid-cols-2">
          <Textarea
            label="Alternativa A"
            rows={2}
            value={form.alternativa_a}
            onChange={(event) => update("alternativa_a", event.target.value)}
            placeholder="Texto da alternativa A..."
            required
          />
          <Textarea
            label="Alternativa B"
            rows={2}
            value={form.alternativa_b}
            onChange={(event) => update("alternativa_b", event.target.value)}
            placeholder="Texto da alternativa B..."
            required
          />
          <Textarea
            label="Alternativa C"
            rows={2}
            value={form.alternativa_c}
            onChange={(event) => update("alternativa_c", event.target.value)}
            placeholder="Texto da alternativa C..."
            required
          />
          <Textarea
            label="Alternativa D"
            rows={2}
            value={form.alternativa_d}
            onChange={(event) => update("alternativa_d", event.target.value)}
            placeholder="Texto da alternativa D..."
            required
          />
        </div>
      </div>

      {/* Disciplina, Assunto, Dificuldade e Gabarito */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
        <Select
          label="Gabarito Correto"
          value={form.correta}
          onChange={(event) => update("correta", event.target.value as QuestaoFormData["correta"])}
          options={CORRETAS.map((item) => ({ label: `Alternativa ${item}`, value: item }))}
        />

        <Combobox
          label="Disciplina"
          value={form.disciplina}
          onChange={handleDisciplineChange}
          options={disciplines.map((d) => ({
            label: d.nome,
            value: d.nome,
            count: d.total_questoes
          }))}
          placeholder="Selecione a disciplina"
          searchPlaceholder="Buscar disciplina..."
          emptyMessage="Nenhuma disciplina cadastrada."
          required
        />

        <Combobox
          label="Assunto"
          value={form.assunto}
          onChange={(val) => update("assunto", val)}
          options={availableSubjects.map((s) => ({
            label: s.nome,
            value: s.nome,
            count: s.total_questoes
          }))}
          placeholder={
            !form.disciplina
              ? "Escolha a disciplina primeiro"
              : availableSubjects.length === 0
              ? "Nenhum assunto nesta disciplina"
              : "Selecione o assunto"
          }
          searchPlaceholder="Buscar assunto..."
          emptyMessage="Nenhum assunto encontrado."
          disabled={!form.disciplina || availableSubjects.length === 0}
          required
        />

        <Select
          label="Dificuldade"
          value={form.dificuldade}
          onChange={(event) => update("dificuldade", event.target.value as QuestaoFormData["dificuldade"])}
          options={DIFICULDADES.map((item) => ({ label: item, value: item }))}
        />
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-3 border-t border-navy-800">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" isLoading={isLoading || isUploading} disabled={isUploading}>
          {initialData ? "Salvar alterações" : "Cadastrar questão"}
        </Button>
      </div>
    </form>
  );
}
