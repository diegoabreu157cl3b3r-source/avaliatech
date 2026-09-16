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
  }, [duplicateId, showToast]);

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

  function removeLogo() {
    setLogoPreview(null);
    setForm((current) => ({ ...current, logoBase64: null, logoMime: null }));
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
      <form
        className="rounded-2xl border border-navy-800 bg-navy-900/60 p-5 sm:p-7 shadow-xs space-y-7"
        onSubmit={handleSubmit}
      >
        {/* Seção 1: Informações da Prova */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Informações da prova</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Dados do cabeçalho institucional e parâmetros da avaliação.
            </p>
          </div>

          <div className="grid gap-3.5 sm:grid-cols-2">
            <Input
              label="Nome da escola"
              value={form.escola}
              onChange={(event) => update("escola", event.target.value)}
              required
            />
            <Input
              label="Nome do professor"
              value={form.professor}
              onChange={(event) => update("professor", event.target.value)}
              required
            />
            <SuggestionInput
              label="Disciplina"
              type="discipline"
              value={form.disciplina}
              onChange={updateDiscipline}
              onSelect={updateDiscipline}
              placeholder="Digite para buscar disciplinas"
            />
            <Input
              label="Data da prova"
              type="date"
              value={form.dataProva}
              onChange={(event) => update("dataProva", event.target.value)}
              required
            />
            <Input
              label="Valor da avaliação"
              value={form.valorAvaliacao}
              onChange={(event) => update("valorAvaliacao", event.target.value)}
              placeholder="Ex.: 10,0"
              required
            />
            <Select
              label="Quantidade de questões"
              value={form.quantidadeQuestoes}
              onChange={(event) =>
                update(
                  "quantidadeQuestoes",
                  Number(event.target.value) as GenerateExamRequest["quantidadeQuestoes"]
                )
              }
              options={QUANTIDADES_PROVA.map((item) => ({
                label: `${item} questões`,
                value: item
              }))}
            />
          </div>
        </section>

        {/* Seção 2: Conteúdo e Assuntos */}
        <section className="border-t border-navy-800 pt-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">Conteúdo</h2>
              <p className="mt-0.5 text-xs text-slate-400">
                Selecione os tópicos da disciplina que serão cobrados.
              </p>
            </div>
            {form.assuntos.length > 0 && (
              <button
                type="button"
                onClick={() => update("assuntos", [])}
                className="text-xs font-medium text-gold-400 hover:text-gold-300 hover:underline"
              >
                Limpar seleção
              </button>
            )}
          </div>

          {form.assuntos.length > 0 && (
            <div className="flex flex-wrap gap-1.5 py-1">
              {form.assuntos.map((assunto) => (
                <span
                  key={assunto}
                  className="inline-flex items-center gap-1.5 rounded-md bg-navy-800 border border-navy-700 px-2.5 py-1 text-xs font-medium text-slate-200"
                >
                  <span>{assunto}</span>
                  <button
                    type="button"
                    onClick={() => removeSubject(assunto)}
                    aria-label={`Remover ${assunto}`}
                    className="rounded p-0.5 text-slate-400 transition hover:text-rose-400"
                  >
                    <X className="h-3 w-3" />
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
            placeholder={
              form.disciplina
                ? "Digite para buscar assuntos"
                : "Escolha uma disciplina primeiro"
            }
          />
        </section>

        {/* Seção 3: Dificuldade */}
        <section className="border-t border-navy-800 pt-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">
              Distribuição de dificuldade
            </h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Defina como o sistema deve selecionar os níveis das questões.
            </p>
          </div>

          {/* Escolha natural de botões */}
          <div className="grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setModoDificuldade("unica")}
              className={`rounded-lg border px-3 py-2.5 text-xs font-semibold transition text-left sm:text-center ${
                modoDificuldade === "unica"
                  ? "border-gold-500/60 bg-navy-850 text-gold-400 ring-1 ring-gold-500/20"
                  : "border-navy-800 bg-navy-950/60 text-slate-400 hover:border-navy-700 hover:text-slate-200"
              }`}
            >
              Dificuldade única
            </button>

            <button
              type="button"
              onClick={() => setModoDificuldade("automatica")}
              className={`flex items-center justify-start sm:justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                modoDificuldade === "automatica"
                  ? "border-gold-500/60 bg-navy-850 text-gold-400 ring-1 ring-gold-500/20"
                  : "border-navy-800 bg-navy-950/60 text-slate-400 hover:border-navy-700 hover:text-slate-200"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              Balanceamento automático
            </button>

            <button
              type="button"
              onClick={() => setModoDificuldade("personalizada")}
              className={`flex items-center justify-start sm:justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-semibold transition ${
                modoDificuldade === "personalizada"
                  ? "border-gold-500/60 bg-navy-850 text-gold-400 ring-1 ring-gold-500/20"
                  : "border-navy-800 bg-navy-950/60 text-slate-400 hover:border-navy-700 hover:text-slate-200"
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              Personalizada
            </button>
          </div>

          {/* Modo Único */}
          {modoDificuldade === "unica" && (
            <div className="max-w-xs pt-1">
              <Select
                label="Nível de dificuldade"
                value={form.dificuldade}
                onChange={(event) =>
                  update(
                    "dificuldade",
                    event.target.value as GenerateExamRequest["dificuldade"]
                  )
                }
                options={DIFICULDADES.map((item) => ({ label: item, value: item }))}
              />
            </div>
          )}

          {/* Modo Automático */}
          {modoDificuldade === "automatica" && (
            <div className="rounded-lg border border-navy-800 bg-navy-950/50 p-3.5">
              <p className="text-xs font-medium text-slate-300">
                Distribuição proporcional para {form.quantidadeQuestoes} questões:
              </p>
              <div className="mt-2.5 flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Fácil: <strong className="text-slate-100">{autoDist.facil}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-amber-400">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Média: <strong className="text-slate-100">{autoDist.media}</strong>
                </span>
                <span className="flex items-center gap-1.5 font-medium text-rose-400">
                  <span className="h-2 w-2 rounded-full bg-rose-400" />
                  Difícil: <strong className="text-slate-100">{autoDist.dificil}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Modo Personalizado */}
          {modoDificuldade === "personalizada" && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {/* Fácil */}
                <div className="rounded-lg border border-navy-800 bg-navy-950/50 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-emerald-400">Fácil</span>
                    <span className="text-[11px] text-slate-400">
                      {Math.round(
                        (customDistribution.facil / (form.quantidadeQuestoes || 1)) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          facil: Math.max(0, curr.facil - 1)
                        }))
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-sm font-bold text-slate-300 transition hover:bg-navy-800"
                      aria-label="Diminuir fáceis"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={form.quantidadeQuestoes}
                      value={customDistribution.facil}
                      onChange={(e) =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          facil: Math.max(0, Number(e.target.value))
                        }))
                      }
                      className="h-8 w-full rounded-lg border border-navy-700 bg-navy-950 text-center text-sm font-bold text-slate-100 outline-none transition focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          facil: Math.min(form.quantidadeQuestoes, curr.facil + 1)
                        }))
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-sm font-bold text-slate-300 transition hover:bg-navy-800"
                      aria-label="Aumentar fáceis"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Média */}
                <div className="rounded-lg border border-navy-800 bg-navy-950/50 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-amber-400">Média</span>
                    <span className="text-[11px] text-slate-400">
                      {Math.round(
                        (customDistribution.media / (form.quantidadeQuestoes || 1)) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          media: Math.max(0, curr.media - 1)
                        }))
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-sm font-bold text-slate-300 transition hover:bg-navy-800"
                      aria-label="Diminuir médias"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={form.quantidadeQuestoes}
                      value={customDistribution.media}
                      onChange={(e) =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          media: Math.max(0, Number(e.target.value))
                        }))
                      }
                      className="h-8 w-full rounded-lg border border-navy-700 bg-navy-950 text-center text-sm font-bold text-slate-100 outline-none transition focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          media: Math.min(form.quantidadeQuestoes, curr.media + 1)
                        }))
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-sm font-bold text-slate-300 transition hover:bg-navy-800"
                      aria-label="Aumentar médias"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Difícil */}
                <div className="rounded-lg border border-navy-800 bg-navy-950/50 p-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-rose-400">Difícil</span>
                    <span className="text-[11px] text-slate-400">
                      {Math.round(
                        (customDistribution.dificil / (form.quantidadeQuestoes || 1)) * 100
                      )}
                      %
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          dificil: Math.max(0, curr.dificil - 1)
                        }))
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-sm font-bold text-slate-300 transition hover:bg-navy-800"
                      aria-label="Diminuir difíceis"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      max={form.quantidadeQuestoes}
                      value={customDistribution.dificil}
                      onChange={(e) =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          dificil: Math.max(0, Number(e.target.value))
                        }))
                      }
                      className="h-8 w-full rounded-lg border border-navy-700 bg-navy-950 text-center text-sm font-bold text-slate-100 outline-none transition focus:border-gold-500"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setCustomDistribution((curr) => ({
                          ...curr,
                          dificil: Math.min(form.quantidadeQuestoes, curr.dificil + 1)
                        }))
                      }
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-navy-700 bg-navy-850 text-sm font-bold text-slate-300 transition hover:bg-navy-800"
                      aria-label="Aumentar difíceis"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Indicador de soma */}
              <div
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-medium ${
                  isCustomSumValid
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-300"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  {isCustomSumValid ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  {isCustomSumValid
                    ? "Total distribuído corretamente."
                    : `Distribuição atual: ${currentCustomSum} de ${form.quantidadeQuestoes} questões.`}
                </span>
                <span className="font-semibold">
                  {currentCustomSum} / {form.quantidadeQuestoes}
                </span>
              </div>
            </div>
          )}
        </section>

        {/* Seção 4: Identidade da Escola */}
        <section className="border-t border-navy-800 pt-6 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Identidade da escola</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Logomarca para exibição no cabeçalho impresso (opcional).
            </p>
          </div>

          {logoPreview ? (
            <div className="flex items-center justify-between rounded-xl border border-navy-800 bg-navy-950/50 p-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Logo anexada"
                  className="h-10 w-10 rounded-lg border border-navy-800 bg-navy-900 object-contain p-1"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Logomarca anexada</p>
                  <p className="text-[11px] text-slate-400">
                    Será exibida no cabeçalho da avaliação.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer text-xs font-semibold text-gold-400 hover:text-gold-300">
                  Alterar
                  <input
                    className="sr-only"
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(event) => handleLogoChange(event.target.files?.[0])}
                  />
                </label>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="text-xs font-medium text-slate-400 hover:text-rose-400"
                >
                  Remover
                </button>
              </div>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-navy-750 bg-navy-950/40 p-4 transition hover:bg-navy-850/40">
              <ImagePlus className="h-5 w-5 text-slate-400" />
              <div className="text-left">
                <span className="block text-xs font-semibold text-slate-200">
                  + Adicionar logo da escola
                </span>
                <span className="text-[11px] text-slate-400">
                  PNG, JPG ou JPEG &bull; até 2 MB
                </span>
              </div>
              <input
                className="sr-only"
                type="file"
                accept="image/png,image/jpeg"
                onChange={(event) => handleLogoChange(event.target.files?.[0])}
              />
            </label>
          )}
        </section>

        {/* Seção 5: Ação de Finalização */}
        <div className="border-t border-navy-800 pt-6 flex justify-end">
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full sm:w-auto gap-2 px-6 py-2.5 text-xs font-semibold"
          >
            <Download className="h-4 w-4" /> Gerar PDF da prova
          </Button>
        </div>
      </form>
    </>
  );
}

