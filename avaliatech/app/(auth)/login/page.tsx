"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Toast } from "@/components/ui/Toast";
import { Logo } from "@/components/ui/Logo";
import { useToast } from "@/hooks/useToast";
import { login } from "@/services/auth-service";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";
  const { toast, showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({ email: "", senha: "" });

  function handleResetForm() {
    setForm({ email: "", senha: "" });
    showToast("Campos do formulário limpos.", "info");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      await login(form);
      showToast("Login realizado com sucesso.", "success");
      router.push(redirect);
      router.refresh();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "Erro ao entrar.", "error");
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
          <h1 className="mt-6 text-2xl font-black text-slate-100">Entrar na plataforma</h1>
          <p className="mt-2 text-sm text-slate-400">Acesse seu banco de questões e gere provas.</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="professor@email.com"
            required
          />

          <div>
            <Input
              label="Senha"
              type="password"
              value={form.senha}
              onChange={(event) => setForm({ ...form, senha: event.target.value })}
              placeholder="Digite sua senha"
              required
            />
            <div className="mt-1.5 flex justify-end">
              <Link
                href="/recuperar-senha"
                className="text-xs font-semibold text-gold-400 hover:text-gold-300 hover:underline"
              >
                Esqueci minha senha
              </Link>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            <Button className="w-full py-3" type="submit" isLoading={isLoading}>
              Entrar
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={handleResetForm}
              className="w-full gap-2 text-xs text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Resetar dados do formulário
            </Button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Ainda não tem conta?{" "}
          <Link className="font-bold text-gold-400 hover:text-gold-300 hover:underline" href="/cadastro">
            Cadastre-se
          </Link>
        </p>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
