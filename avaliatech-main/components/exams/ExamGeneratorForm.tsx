"use client";

import { FormEvent, useEffect, useState } from "react";
import { Download, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { DIFICULDADES, QUANTIDADES_PROVA } from "@/lib/constants";
import { generateExamPdf } from "@/services/exam-service";
import { getProfile } from "@/services/profile-service";
import type { GenerateExamRequest } from "@/types/exam";

const today = new Date().toISOString().slice(0, 10);

export function ExamGeneratorForm() {
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState<GenerateExamRequest>({
    escola: "",
    professor: "",
    disciplina: "",
    assunto: "",
    dificuldade: "Fácil",
    quantidadeQuestoes: 10,
    dataProva: today,
    valorAvaliacao: "10,0",
    logoBase64: null,
    logoMime: null
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();
        if (response.data) {
          setForm((current) => ({
            ...current,
            professor: current.professor || response.data?.nome || "",
            logoBase64: current.logoBase64 || response.data?.logo_base64 || null,
            logoMime: current.logoMime || (response.data?.logo_mime as "image/png" | "image/jpeg" | null) || null
          }));
          if (response.data.logo_base64) setLogoPreview(response.data.logo_base64);
        }
      } catch {
        // O formulário continua funcionando mesmo sem logo padrão.
      }
    }

    loadProfile();
  }, []);

  function update<K extends keyof GenerateExamRequest>(key: K, value: GenerateExamRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleLogoChange(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      showToast("Envie uma logo PNG, JPG ou JPEG.", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("A logo deve ter no máximo 2 MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      setLogoPreview(result);
      setForm((current) => ({ ...current, logoBase64: result, logoMime: file.type as "image/png" | "image/jpeg" }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const blob = await generateExamPdf(form);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `avaliatech-${form.disciplina || "prova"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast("PDF gerado com sucesso.", "success");
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao gerar prova.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} />}
      <form className="card space-y-5" onSubmit={handleSubmit}>
        <div>
          <h2 className="text-xl font-black text-slate-900">Dados da prova</h2>
          <p className="mt-1 text-sm text-slate-500">A seleção das questões é automática. Não existe carrinho nem escolha manual.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nome da escola" value={form.escola} onChange={(event) => update("escola", event.target.value)} required />
          <Input label="Nome do professor" value={form.professor} onChange={(event) => update("professor", event.target.value)} required />
          <Input label="Disciplina" value={form.disciplina} onChange={(event) => update("disciplina", event.target.value)} required />
          <Input label="Assunto" value={form.assunto} onChange={(event) => update("assunto", event.target.value)} required />
          <Input label="Data da prova" type="date" value={form.dataProva} onChange={(event) => update("dataProva", event.target.value)} required />
          <Input label="Valor da avaliação" value={form.valorAvaliacao} onChange={(event) => update("valorAvaliacao", event.target.value)} placeholder="Ex.: 10,0" required />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Dificuldade"
            value={form.dificuldade}
            onChange={(event) => update("dificuldade", event.target.value as GenerateExamRequest["dificuldade"])}
            options={DIFICULDADES.map((item) => ({ label: item, value: item }))}
          />
          <Select
            label="Quantidade de questões"
            value={form.quantidadeQuestoes}
            onChange={(event) => update("quantidadeQuestoes", Number(event.target.value) as GenerateExamRequest["quantidadeQuestoes"])}
            options={QUANTIDADES_PROVA.map((item) => ({ label: `${item} questões`, value: item }))}
          />
        </div>

        <div className="rounded-3xl border border-dashed border-slate-300 p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-slate-50 p-5 text-center transition hover:bg-slate-100">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Prévia da logo" className="max-h-24 rounded-xl object-contain" />
            ) : (
              <ImagePlus className="h-10 w-10 text-slate-400" />
            )}
            <span className="text-sm font-bold text-slate-700">Enviar logo da escola</span>
            <span className="text-xs text-slate-500">PNG, JPG ou JPEG até 2 MB</span>
            <input className="sr-only" type="file" accept="image/png,image/jpeg" onChange={(event) => handleLogoChange(event.target.files?.[0])} />
          </label>
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full gap-2 md:w-auto">
          <Download className="h-4 w-4" /> Gerar PDF da prova
        </Button>
      </form>
    </>
  );
}
