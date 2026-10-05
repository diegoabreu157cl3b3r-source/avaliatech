"use client";

import { FormEvent, useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { DIFICULDADES_IA, QUANTIDADES_GERACAO_IA } from "@/lib/constants";
import { createQuestion, generateQuestionsWithAI } from "@/services/question-service";
import type { AIQuestion, GenerateQuestionsRequest } from "@/types/question";

interface AIGenerateQuestionsProps {
  onSaved: () => Promise<void>;
  onClose: () => void;
  notify: (message: string, type: "success" | "error" | "info") => void;
}

const initialForm: GenerateQuestionsRequest = { disciplina: "", assunto: "", dificuldade: "Fácil", quantidade: 5, descricao: "" };

export function AIGenerateQuestions({ onSaved, onClose, notify }: AIGenerateQuestionsProps) {
  const [form, setForm] = useState(initialForm);
  const [questions, setQuestions] = useState<AIQuestion[]>([]);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [isGenerating, setIsGenerating] = useState(false);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [isSavingAll, setIsSavingAll] = useState(false);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsGenerating(true);
    try {
      const response = await generateQuestionsWithAI(form);
      setQuestions(response.data?.questions ?? []);
      setSaved(new Set());
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível gerar as questões.", "error");
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveQuestion(index: number) {
    const question = questions[index];
    if (!question || saved.has(index)) return;
    setSavingId(index);
    try {
      await createQuestion(question);
      setSaved((current) => new Set(current).add(index));
      await onSaved();
    } catch (error) {
      notify(error instanceof Error ? error.message : "Não foi possível salvar a questão.", "error");
    } finally {
      setSavingId(null);
    }
  }

  async function saveAll() {
    const pending = questions.map((_, index) => index).filter((index) => !saved.has(index));
    if (!pending.length) return;
    setIsSavingAll(true);
    let failed = 0;
    for (const index of pending) {
      try {
        await createQuestion(questions[index]);
        setSaved((current) => new Set(current).add(index));
      } catch {
        failed += 1;
      }
    }
    await onSaved();
    setIsSavingAll(false);
    notify(failed ? "Algumas questões não puderam ser salvas. Revise e tente novamente." : "Todas as questões foram salvas.", failed ? "error" : "success");
  }

  function discard(index: number) {
    if (saved.has(index)) return;
    setQuestions((current) => current.filter((_, questionIndex) => questionIndex !== index));
    setSaved((current) => new Set([...current].filter((savedIndex) => savedIndex !== index).map((savedIndex) => savedIndex > index ? savedIndex - 1 : savedIndex)));
  }

  if (questions.length > 0) {
    const pendingCount = questions.length - saved.size;
    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-3 rounded-2xl border border-navy-700 bg-navy-850 p-4 transition sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-slate-200">Revise as questões antes de adicioná-las ao banco.</p>
          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={() => { setQuestions([]); setSaved(new Set()); }}>Gerar novamente</Button>
            <Button type="button" onClick={saveAll} isLoading={isSavingAll} disabled={!pendingCount || savingId !== null}>Salvar todas ({pendingCount})</Button>
          </div>
        </div>
        {questions.map((question, index) => (
          <article key={`${question.pergunta}-${index}`} className="rounded-2xl border border-navy-700 bg-navy-900 p-4.5 transition text-slate-100">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gold-400">Questão {index + 1}</p>
                <p className="mt-1 font-bold text-slate-100">{question.pergunta}</p>
              </div>
              {saved.has(index) && <span className="inline-flex shrink-0 items-center gap-1 text-sm font-bold text-emerald-400"><Check className="h-4 w-4" /> Salva</span>}
            </div>
            <ol className="space-y-1.5 text-sm text-slate-300">
              {(["A", "B", "C", "D"] as const).map((letter) => (
                <li key={letter}>
                  <span className={question.correta === letter ? "font-bold text-gold-400" : ""}>
                    {letter}) {question[`alternativa_${letter.toLowerCase()}` as "alternativa_a" | "alternativa_b" | "alternativa_c" | "alternativa_d"]}
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-xs text-slate-400">
              Resposta correta: <strong className="text-gold-400">{question.correta}</strong> · {question.disciplina} · {question.assunto} · <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold border border-navy-700 bg-navy-850 text-slate-300">{question.dificuldade}</span>
            </p>
            {!saved.has(index) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button type="button" className="py-2" onClick={() => saveQuestion(index)} isLoading={savingId === index} disabled={isSavingAll || savingId !== null}>Salvar no banco</Button>
                <Button type="button" variant="ghost" className="gap-1 py-2" onClick={() => discard(index)} disabled={isSavingAll || savingId !== null}><Trash2 className="h-4 w-4" />Descartar</Button>
              </div>
            )}
          </article>
        ))}
        <div className="flex justify-end"><Button type="button" variant="ghost" onClick={onClose}>Fechar</Button></div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={generate}>
      <p className="text-sm text-slate-400">As questões serão geradas por IA para sua revisão e não serão salvas automaticamente.</p>
      <Input label="Disciplina" value={form.disciplina} onChange={(event) => setForm((current) => ({ ...current, disciplina: event.target.value }))} required />
      <Input label="Assunto" value={form.assunto} onChange={(event) => setForm((current) => ({ ...current, assunto: event.target.value }))} required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Dificuldade" value={form.dificuldade} onChange={(event) => setForm((current) => ({ ...current, dificuldade: event.target.value as GenerateQuestionsRequest["dificuldade"] }))} options={DIFICULDADES_IA.map((item) => ({ label: item, value: item }))} />
        <Select label="Quantidade" value={String(form.quantidade)} onChange={(event) => setForm((current) => ({ ...current, quantidade: Number(event.target.value) as GenerateQuestionsRequest["quantidade"] }))} options={QUANTIDADES_GERACAO_IA.map((item) => ({ label: String(item), value: String(item) }))} />
      </div>
      <Textarea
        label="Descrição / Instruções adicionais (opcional)"
        value={form.descricao ?? ""}
        onChange={(event) => setForm((current) => ({ ...current, descricao: event.target.value }))}
        placeholder="Ex.: Crie questões contextualizadas para alunos do 3º ano do ensino médio. Utilize situações do cotidiano, evite perguntas muito fáceis e priorize interpretação e raciocínio."
        maxLength={1000}
      />
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end pt-2">
        <Button type="button" variant="ghost" onClick={onClose} disabled={isGenerating}>Cancelar</Button>
        <Button type="submit" isLoading={isGenerating}>Gerar questões com IA</Button>
      </div>
    </form>
  );
}
