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
            logoMime: response.data?.logo_mime === "image/png" || response.data?.logo_mime === "image/jpeg" ? response.data.logo_mime : null
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
    setIsSaving(true);

    try {
      await updateProfile(form);
      showToast("Perfil atualizado com sucesso.", "success");
      setForm((current) => ({ ...current, senhaAtual: "", novaSenha: "", confirmarNovaSenha: "" }));
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
      <section className="rounded-3xl bg-white p-5 shadow-soft">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-700">Minha conta</p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">Perfil do professor</h1>
        <p className="mt-2 text-sm text-slate-500">Atualize seus dados, altere sua senha e salve uma logo padrão da escola.</p>
      </section>

      <form className="card space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
          <Input label="E-mail" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
        </div>

        <div className="rounded-3xl bg-slate-50 p-4">
          <h2 className="font-black text-slate-900">Alterar senha</h2>
          <p className="mt-1 text-sm text-slate-500">Deixe em branco caso não deseje trocar a senha.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <Input label="Senha atual" type="password" value={form.senhaAtual} onChange={(event) => setForm({ ...form, senhaAtual: event.target.value })} />
            <Input label="Nova senha" type="password" value={form.novaSenha} onChange={(event) => setForm({ ...form, novaSenha: event.target.value })} />
            <Input label="Confirmar nova senha" type="password" value={form.confirmarNovaSenha} onChange={(event) => setForm({ ...form, confirmarNovaSenha: event.target.value })} />
          </div>
        </div>

        <div className="rounded-3xl border border-dashed border-slate-300 p-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl bg-slate-50 p-5 text-center transition hover:bg-slate-100">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Logo padrão" className="max-h-24 rounded-xl object-contain" />
            ) : (
              <ImagePlus className="h-10 w-10 text-slate-400" />
            )}
            <span className="text-sm font-bold text-slate-700">Logo padrão da escola</span>
            <span className="text-xs text-slate-500">Será usada automaticamente na página Gerar Prova.</span>
            <input className="sr-only" type="file" accept="image/png,image/jpeg" onChange={(event) => handleLogoChange(event.target.files?.[0])} />
          </label>
        </div>

        <Button type="submit" isLoading={isSaving} className="gap-2">
          <Save className="h-4 w-4" /> Salvar perfil
        </Button>
      </form>
    </div>
  );
}
