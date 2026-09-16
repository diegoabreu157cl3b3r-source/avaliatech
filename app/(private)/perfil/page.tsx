"use client";

import { FormEvent, useEffect, useState } from "react";
import { ImagePlus, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { getProfile, updateProfile } from "@/services/profile-service";

export default function PerfilPage() {
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
    logoBase64: null as string | null,
    logoMime: null as "image/png" | "image/jpeg" | null
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await getProfile();
        if (response.data) {
          setForm((current) => ({
            ...current,
            nome: response.data?.nome ?? "",
            email: response.data?.email ?? "",
            logoBase64: response.data?.logo_base64 ?? null,
            logoMime:
              response.data?.logo_mime === "image/png" || response.data?.logo_mime === "image/jpeg"
                ? response.data.logo_mime
                : null
          }));
          setLogoPreview(response.data.logo_base64 ?? null);
        }
      } catch (error) {
        showToast(error instanceof Error ? error.message : "Erro ao carregar perfil.", "error");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [showToast]);

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
      setForm((current) => ({
        ...current,
        logoBase64: result,
        logoMime: file.type as "image/png" | "image/jpeg"
      }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    try {
      await updateProfile(form);
      showToast("Perfil atualizado com sucesso.", "success");
      setForm((current) => ({
        ...current,
        senhaAtual: "",
        novaSenha: "",
        confirmarNovaSenha: ""
      }));
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao salvar perfil.", "error");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Skeleton className="h-[520px]" />;

  return (
    <div className="space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Perfil do professor</h1>
        <p className="mt-1 text-sm text-slate-400">
          Atualize seus dados, altere sua senha e defina a logo padrão da escola.
        </p>
      </div>

      <form
        className="rounded-2xl border border-navy-800 bg-navy-900/60 p-5 sm:p-7 shadow-xs space-y-7"
        onSubmit={handleSubmit}
      >
        {/* Dados Básicos */}
        <section className="space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Dados pessoais</h2>
            <p className="mt-0.5 text-xs text-slate-400">Identificação do docente na plataforma.</p>
          </div>
          <div className="grid gap-3.5 md:grid-cols-2">
            <Input
              label="Nome"
              value={form.nome}
              onChange={(event) => setForm({ ...form, nome: event.target.value })}
              required
            />
            <Input
              label="E-mail"
              type="email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              required
            />
          </div>
        </section>

        {/* Alterar Senha */}
        <section className="border-t border-navy-800 pt-6 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Segurança</h2>
            <p className="mt-0.5 text-xs text-slate-400">Deixe os campos em branco caso não deseje alterar a senha.</p>
          </div>
          <div className="grid gap-3.5 md:grid-cols-3">
            <Input
              label="Senha atual"
              type="password"
              value={form.senhaAtual}
              onChange={(event) => setForm({ ...form, senhaAtual: event.target.value })}
            />
            <Input
              label="Nova senha"
              type="password"
              value={form.novaSenha}
              onChange={(event) => setForm({ ...form, novaSenha: event.target.value })}
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              value={form.confirmarNovaSenha}
              onChange={(event) => setForm({ ...form, confirmarNovaSenha: event.target.value })}
            />
          </div>
        </section>

        {/* Logo Padrão */}
        <section className="border-t border-navy-800 pt-6 space-y-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-100">Logo padrão da instituição</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Será pré-carregada automaticamente sempre que você abrir o gerador de provas.
            </p>
          </div>

          {logoPreview ? (
            <div className="flex items-center justify-between rounded-xl border border-navy-800 bg-navy-950/50 p-3">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logoPreview}
                  alt="Logo padrão"
                  className="h-10 w-10 rounded-lg border border-navy-800 bg-navy-900 object-contain p-1"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-200">Logomarca salva</p>
                  <p className="text-[11px] text-slate-400">Logo institucional ativa no seu perfil.</p>
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
                  onClick={() => {
                    setLogoPreview(null);
                    setForm((curr) => ({ ...curr, logoBase64: null, logoMime: null }));
                  }}
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
                  + Adicionar logo padrão da escola
                </span>
                <span className="text-[11px] text-slate-400">PNG, JPG ou JPEG &bull; até 2 MB</span>
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

        <div className="border-t border-navy-800 pt-6 flex justify-end">
          <Button type="submit" isLoading={isSaving} className="w-full sm:w-auto gap-2 px-6 py-2.5 text-xs font-semibold">
            <Save className="h-4 w-4" /> Salvar alterações
          </Button>
        </div>
      </form>
    </div>
  );
}
