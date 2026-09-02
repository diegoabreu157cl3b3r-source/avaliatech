"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Download, ImagePlus, Plus, X, Sparkles, Sliders, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SuggestionInput } from "@/components/ui/SuggestionInput";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { DIFICULDADES, QUANTIDADES_PROVA } from "@/lib/constants";
import { calculateAutoDistribution } from "@/lib/exam";
import { generateExamPdf, getExamDetails } from "@/services/exam-service";
import { getProfile } from "@/services/profile-service";
import type { DistribuicaoDificuldade, GenerateExamRequest, ModoDificuldade } from "@/types/exam";

const today = new Date().toISOString().slice(0, 10);

export function ExamGeneratorForm() {
  const { toast, showToast } = useToast();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get("duplicar");

  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [modoDificuldade, setModoDificuldade] = useState<ModoDificuldade>("unica");
  const [customDistribution, setCustomDistribution] = useState<DistribuicaoDificuldade>({
    facil: 3,
    media: 5,
    dificil: 2
  });

  const [form, setForm] = useState<GenerateExamRequest>({
    escola: "",
    professor: "",
    disciplina: "",
    assuntos: [],
    dificuldade: "Fácil",
    modoDificuldade: "unica",
    quantidadeQuestoes: 10,
    dataProva: today,
    valorAvaliacao: "10,0",
    logoBase64: null,
    logoMime: null
  });
  const [subjectDraft, setSubjectDraft] = useState("");

  // Carrega dados do perfil e duplicação se houver
  useEffect(() => {
    async function loadInitialData() {
      try {
        const profileRes = await getProfile();
        if (profileRes.data) {
          setForm((current) => ({
            ...current,
            professor: current.professor || profileRes.data?.nome || "",
            logoBase64: current.logoBase64 || profileRes.data?.logo_base64 || null,
            logoMime: current.logoMime || (profileRes.data?.logo_mime as "image/png" | "image/jpeg" | null) || null
          }));
          if (profileRes.data.logo_base64) setLogoPreview(profileRes.data.logo_base64);
        }

        if (duplicateId) {
          const examRes = await getExamDetails(Number(duplicateId));
          if (examRes.data?.exam) {
            const ex = examRes.data.exam;
            const subjects = ex.assunto.split(",").map((s) => s.trim()).filter(Boolean);
            setForm((current) => ({
              ...current,
              escola: ex.escola,
              professor: ex.professor,
              disciplina: ex.disciplina,
              assuntos: subjects,
              dificuldade: ex.dificuldade,
              quantidadeQuestoes: ex.quantidade_questoes as 10 | 15 | 20 | 25,
              valorAvaliacao: ex.valor_avaliacao || "10,0"
            }));
            showToast("Dados da prova carregados para duplicação.", "info");
          }
        }
      } catch {
        // Continua sem falhar
      }
    }

    loadInitialData();
  }, [duplicateId]);

  // Atualiza distribuição personalizada quando muda a quantidade total
  useEffect(() => {
    const auto = calculateAutoDistribution(form.quantidadeQuestoes);
    setCustomDistribution(auto);
  }, [form.quantidadeQuestoes]);

  function update<K extends keyof GenerateExamRequest>(key: K, value: GenerateExamRequest[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateDiscipline(disciplina: string) {
    setForm((current) => ({ ...current, disciplina, assuntos: current.disciplina === disciplina ? current.assuntos : [] }));
    setSubjectDraft("");
  }

  function addSubject(assunto: string) {
    setForm((current) => current.assuntos.includes(assunto) ? current : { ...current, assuntos: [...current.assuntos, assunto] });
    setSubjectDraft("");
  }

  function removeSubject(assunto: string) {
    setForm((current) => ({ ...current, assuntos: current.assuntos.filter((item) => item !== assunto) }));
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

  const currentCustomSum = customDistribution.facil + customDistribution.media + customDistribution.dificil;
  const isCustomSumValid = currentCustomSum === form.quantidadeQuestoes;
  const autoDist = calculateAutoDistribution(form.quantidadeQuestoes);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.assuntos.length === 0) {
      showToast("Selecione pelo menos um assunto.", "error");
      return;
    }

    if (modoDificuldade === "personalizada" && !isCustomSumValid) {
      showToast(
        `Você selecionou ${form.quantidadeQuestoes} questões, mas a distribuição atual totaliza ${currentCustomSum}.`,
        "error"
      );
      return;
    }

    setIsLoading(true);

    const payload: GenerateExamRequest = {
      ...form,
      modoDificuldade,
      dificuldade:
        modoDificuldade === "automatica"
          ? "Balanceada"
          : modoDificuldade === "personalizada"
          ? "Personalizada"
          : form.dificuldade,
      distribuicao:
        modoDificuldade === "automatica"
          ? autoDist
          : modoDificuldade === "personalizada"
          ? customDistribution
          : null
    };

    try {
      const blob = await generateExamPdf(payload);
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
      <form className="card space-y-6" onSubmit={handleSubmit}>
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">Dados da prova</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            A seleção das questões é automática. Escolha as configurações e gere o PDF com versões A e B.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nome da escola" value={form.escola} onChange={(event) => update("escola", event.target.value)} required />
          <Input label="Nome do professor" value={form.professor} onChange={(event) => update("professor", event.target.value)} required />
          <SuggestionInput
            label="Disciplina"
            type="discipline"
            value={form.disciplina}
            onChange={updateDiscipline}
            onSelect={updateDiscipline}
            placeholder="Digite para buscar disciplinas"
          />
          <Input label="Data da prova" type="date" value={form.dataProva} onChange={(event) => update("dataProva", event.target.value)} required />
          <Input label="Valor da avaliação" value={form.valorAvaliacao} onChange={(event) => update("valorAvaliacao", event.target.value)} placeholder="Ex.: 10,0" required />
          <Select
            label="Quantidade de questões"
            value={form.quantidadeQuestoes}
            onChange={(event) => update("quantidadeQuestoes", Number(event.target.value) as GenerateExamRequest["quantidadeQuestoes"])}
            options={QUANTIDADES_PROVA.map((item) => ({ label: `${item} questões`, value: item }))}
          />
        </div>

        {/* Seleção de Assuntos */}
        <div className="rounded-2xl border border-slate-200 p-4 transition dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="label">Assuntos</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Selecione um ou mais assuntos da disciplina escolhida.</p>
            </div>
            {form.assuntos.length > 0 && (
              <button
                type="button"
                onClick={() => update("assuntos", [])}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
              >
                Limpar seleção
              </button>
            )}
          </div>
          {form.assuntos.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {form.assuntos.map((assunto) => (
                <span
                  key={assunto}
                  className="inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-3 py-1 text-sm font-bold text-white shadow-sm"
                >
                  <span>{assunto}</span>
                  <button
                    type="button"
                    onClick={() => removeSubject(assunto)}
                    aria-label={`Remover ${assunto}`}
                    className="rounded-full p-0.5 text-white/80 transition hover:bg-brand-700 hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <SuggestionInput
            label="Adicionar assunto"
            type="subject"
            value={subjectDraft}
            onChange={setSubjectDraft}
            onSelect={addSubject}
            discipline={form.disciplina}
            disabled={!form.disciplina}
            placeholder={form.disciplina ? "Digite para buscar assuntos" : "Escolha uma disciplina primeiro"}
          />
          <p className="mt-2 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400"><Plus className="h-3.5 w-3.5" /> Selecione uma sugestão para adicionar o assunto.</p>
        </div>

        {/* Gerador Inteligente de Dificuldade */}
        <div className="rounded-2xl border border-slate-200 p-4.5 transition dark:border-slate-800 dark:bg-slate-800/40">
          <div className="mb-3">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              Distribuição de Dificuldade
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escolha uma dificuldade única ou utilize distribuição inteligente balanceada / personalizada.
            </p>
          </div>

          {/* Seletor de Modo */}
          <div className="grid gap-2 sm:grid-cols-3 mb-4">
            <button
              type="button"
              onClick={() => setModoDificuldade("unica")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                modoDificuldade === "unica"
                  ? "border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-500 dark:bg-brand-950/80 dark:text-brand-200 ring-2 ring-brand-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              Dificuldade única
            </button>

            <button
              type="button"
              onClick={() => setModoDificuldade("automatica")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                modoDificuldade === "automatica"
                  ? "border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-500 dark:bg-brand-950/80 dark:text-brand-200 ring-2 ring-brand-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
              Balanceamento automático
            </button>

            <button
              type="button"
              onClick={() => setModoDificuldade("personalizada")}
              className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-xs font-bold transition ${
                modoDificuldade === "personalizada"
                  ? "border-brand-600 bg-brand-50 text-brand-800 dark:border-brand-500 dark:bg-brand-950/80 dark:text-brand-200 ring-2 ring-brand-500/20"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              Distribuição personalizada
            </button>
          </div>

          {/* Conteúdo de acordo com o modo selecionado */}
          {modoDificuldade === "unica" && (
            <div className="max-w-md">
              <Select
                label="Nível de dificuldade"
                value={form.dificuldade}
                onChange={(event) => update("dificuldade", event.target.value as GenerateExamRequest["dificuldade"])}
                options={DIFICULDADES.map((item) => ({ label: item, value: item }))}
              />
            </div>
          )}

          {modoDificuldade === "automatica" && (
            <div className="rounded-xl border border-brand-200 bg-brand-50/70 p-4 dark:border-brand-800/60 dark:bg-slate-900/60">
              <p className="text-xs font-bold text-brand-900 dark:text-brand-300">
                Distribuição calculada para {form.quantidadeQuestoes} questões:
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
                  <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400">Fácil</span>
                  <strong className="mt-1 block text-lg font-black text-slate-900 dark:text-slate-100">{autoDist.facil}</strong>
                  <span className="text-[10px] text-slate-400">questões</span>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
                  <span className="text-[11px] font-bold text-amber-700 dark:text-amber-400">Média</span>
                  <strong className="mt-1 block text-lg font-black text-slate-900 dark:text-slate-100">{autoDist.media}</strong>
                  <span className="text-[10px] text-slate-400">questões</span>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-xs dark:border-slate-800 dark:bg-slate-800/90">
                  <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">Difícil</span>
                  <strong className="mt-1 block text-lg font-black text-slate-900 dark:text-slate-100">{autoDist.dificil}</strong>
                  <span className="text-[10px] text-slate-400">questões</span>
                </div>
              </div>
            </div>
          )}

          {modoDificuldade === "personalizada" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="label text-emerald-700 dark:text-emerald-400">Fácil</label>
                  <input
                    type="number"
                    min={0}
                    max={form.quantidadeQuestoes}
                    value={customDistribution.facil}
                    onChange={(e) =>
                      setCustomDistribution((curr) => ({ ...curr, facil: Math.max(0, Number(e.target.value)) }))
                    }
                    className="input font-bold"
                  />
                </div>
                <div>
                  <label className="label text-amber-700 dark:text-amber-400">Média</label>
                  <input
                    type="number"
                    min={0}
                    max={form.quantidadeQuestoes}
                    value={customDistribution.media}
                    onChange={(e) =>
                      setCustomDistribution((curr) => ({ ...curr, media: Math.max(0, Number(e.target.value)) }))
                    }
                    className="input font-bold"
                  />
                </div>
                <div>
                  <label className="label text-rose-700 dark:text-rose-400">Difícil</label>
                  <input
                    type="number"
                    min={0}
                    max={form.quantidadeQuestoes}
                    value={customDistribution.dificil}
                    onChange={(e) =>
                      setCustomDistribution((curr) => ({ ...curr, dificil: Math.max(0, Number(e.target.value)) }))
                    }
                    className="input font-bold"
                  />
                </div>
              </div>

              {/* Validador de soma em tempo real */}
              <div
                className={`flex items-center justify-between rounded-xl border p-3 text-xs font-semibold ${
                  isCustomSumValid
                    ? "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800/80 dark:bg-emerald-950/40 dark:text-emerald-200"
                    : "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800/80 dark:bg-amber-950/40 dark:text-amber-200"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isCustomSumValid ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  )}
                  {isCustomSumValid
                    ? "Soma correta das dificuldades."
                    : `Distribuição atual: ${currentCustomSum} de ${form.quantidadeQuestoes} questões.`}
                </span>
                <span className="font-bold">
                  {currentCustomSum} / {form.quantidadeQuestoes}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Upload de Logo */}
        <div className="rounded-3xl border border-dashed border-slate-300 p-4 transition dark:border-slate-700">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-slate-50 p-5 text-center transition hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800/80">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Prévia da logo" className="max-h-24 rounded-xl object-contain" />
            ) : (
              <ImagePlus className="h-10 w-10 text-slate-400 dark:text-slate-500" />
            )}
            <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Enviar logo da escola</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">PNG, JPG ou JPEG até 2 MB</span>
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

