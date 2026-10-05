"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { Logo } from "@/components/ui/Logo";
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
    <main className="flex min-h-screen items-center justify-center bg-navy-950 p-4 transition">
      {toast && <Toast message={toast.message} type={toast.type} />}
      <section className="w-full max-w-md rounded-3xl border border-navy-700 bg-navy-900 p-7 sm:p-8 shadow-2xl transition text-slate-100">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center justify-center transition hover:opacity-90" aria-label="AvaliaTech">
            <Logo size="xl" priority />
          </Link>
          <h1 className="mt-6 text-2xl font-black text-slate-100">Criar conta</h1>
          <p className="mt-2 text-sm text-slate-400">Cada professor terá acesso apenas às próprias questões.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Nome completo" value={form.nome} onChange={(event) => setForm({ ...form, nome: event.target.value })} placeholder="Prof. João Silva" required />
          <Input label="E-mail" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="professor@email.com" required />
          <Input label="Senha" type="password" value={form.senha} onChange={(event) => setForm({ ...form, senha: event.target.value })} placeholder="Crie uma senha forte" required />
          <Input label="Confirmar senha" type="password" value={form.confirmarSenha} onChange={(event) => setForm({ ...form, confirmarSenha: event.target.value })} placeholder="Repita a senha" required />
          <Button className="mt-2 w-full py-3" type="submit" isLoading={isLoading}>Cadastrar</Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Já tem conta?{" "}
          <Link className="font-bold text-gold-400 hover:text-gold-300 hover:underline" href="/login">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
