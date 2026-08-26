"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { register } from "@/services/auth-service";

export default function CadastroPage() {
  const router = useRouter();
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ nome: "", email: "", senha: "", confirmarSenha: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await register(form);
      showToast("Cadastro realizado com sucesso.", "success");
      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao cadastrar.", "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block rounded-2xl bg-slate-950 px-4 py-3 text-lg font-black text-white">
            AvaliaTech
          </Link>
          <h1 className="mt-5 text-2xl font-black text-slate-900">Criar conta</h1>
          <p className="mt-2 text-sm text-slate-500">Cada professor terá acesso apenas às próprias questões.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Nome" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} required />
          <Input label="E-mail" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required />
          <Input label="Senha" type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} required />
          <Input label="Confirmar senha" type="password" value={form.confirmarSenha} onChange={(event) => setForm({ ...form, confirmarSenha: event.target.value })} required />
          <Button className="w-full" type="submit" isLoading={isLoading}>Cadastrar</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Já tem conta? <Link className="font-bold text-brand-700" href="/login">Entrar</Link>
        </p>
      </section>
    </main>
  );
}
