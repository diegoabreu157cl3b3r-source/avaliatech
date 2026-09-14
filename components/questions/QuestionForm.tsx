"use client";

import { FormEvent, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { CORRETAS, DIFICULDADES } from "@/lib/constants";
import { uploadQuestionImage } from "@/services/question-service";
import type { Questao, QuestaoFormData } from "@/types/question";

const emptyForm: QuestaoFormData = { pergunta: "", imagem: null, alternativa_a: "", alternativa_b: "", alternativa_c: "", alternativa_d: "", correta: "A", disciplina: "", assunto: "", dificuldade: "Fácil" };
interface QuestionFormProps { initialData?: Questao | null; onSubmit: (data: QuestaoFormData) => Promise<void>; onCancel?: () => void; }

export function QuestionForm({ initialData, onSubmit, onCancel }: QuestionFormProps) {
  const [form, setForm] = useState<QuestaoFormData>(initialData ? {
    pergunta: initialData.pergunta, imagem: initialData.imagem, alternativa_a: initialData.alternativa_a,
    alternativa_b: initialData.alternativa_b, alternativa_c: initialData.alternativa_c, alternativa_d: initialData.alternativa_d,
    correta: initialData.correta, disciplina: initialData.disciplina, assunto: initialData.assunto, dificuldade: initialData.dificuldade
  } : emptyForm);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  function update<K extends keyof QuestaoFormData>(key: K, value: QuestaoFormData[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setUploadError("Use uma imagem PNG, JPG, JPEG ou WebP de até 5 MB.");
      event.target.value = "";
      return;
    }
    setIsUploading(true);
    try { update("imagem", await uploadQuestionImage(file)); }
    catch (error) { setUploadError(error instanceof Error ? error.message : "Erro ao enviar imagem."); }
    finally { setIsUploading(false); event.target.value = ""; }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsLoading(true);
    try { await onSubmit(form); if (!initialData) setForm(emptyForm); } finally { setIsLoading(false); }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <Textarea label="Pergunta" value={form.pergunta} onChange={(event) => update("pergunta", event.target.value)} required />
      <div className="rounded-2xl border border-dashed border-navy-700 bg-navy-950/60 p-4 transition">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-bold text-slate-200">Imagem da questão (opcional)</p>
            <p className="mt-1 text-xs text-slate-400">PNG, JPG, JPEG ou WebP, até 5 MB.</p>
          </div>
          <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-navy-700 bg-navy-850 px-3.5 py-2 text-xs font-bold text-slate-200 transition hover:bg-navy-800 hover:border-gold-500/30">
            <ImagePlus className="h-4 w-4 text-gold-400" />
            {isUploading ? "Enviando..." : "Selecionar imagem"}
            <input className="sr-only" type="file" accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" onChange={handleImageChange} disabled={isUploading} />
          </label>
        </div>
        {uploadError && <p className="mt-2 text-xs font-semibold text-rose-400">{uploadError}</p>}
        {form.imagem && (
          <div className="relative mt-4 overflow-hidden rounded-xl border border-navy-700 bg-navy-900 p-2">
            <img src={form.imagem} alt="Prévia da imagem da questão" className="max-h-72 w-full object-contain" />
            <Button type="button" variant="danger" size="icon" className="absolute right-3 top-3" onClick={() => update("imagem", null)} aria-label="Remover imagem">
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Alternativa A" value={form.alternativa_a} onChange={(event) => update("alternativa_a", event.target.value)} required />
        <Input label="Alternativa B" value={form.alternativa_b} onChange={(event) => update("alternativa_b", event.target.value)} required />
        <Input label="Alternativa C" value={form.alternativa_c} onChange={(event) => update("alternativa_c", event.target.value)} required />
        <Input label="Alternativa D" value={form.alternativa_d} onChange={(event) => update("alternativa_d", event.target.value)} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Select label="Correta" value={form.correta} onChange={(event) => update("correta", event.target.value as QuestaoFormData["correta"])} options={CORRETAS.map((item) => ({ label: item, value: item }))} />
        <Input label="Disciplina" value={form.disciplina} onChange={(event) => update("disciplina", event.target.value)} required />
        <Input label="Assunto" value={form.assunto} onChange={(event) => update("assunto", event.target.value)} required />
        <Select label="Dificuldade" value={form.dificuldade} onChange={(event) => update("dificuldade", event.target.value as QuestaoFormData["dificuldade"])} options={DIFICULDADES.map((item) => ({ label: item, value: item }))} />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-2">
        {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>}
        <Button type="submit" isLoading={isLoading || isUploading} disabled={isUploading}>{initialData ? "Salvar alterações" : "Cadastrar questão"}</Button>
      </div>
    </form>
  );
}
