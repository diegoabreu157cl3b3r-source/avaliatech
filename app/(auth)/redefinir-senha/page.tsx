"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AlertCircle, ArrowLeft, CheckCircle2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

function RedefinirSenhaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const { toast, showToast } = useToast();
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!token || !email) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy-950 p-4 transition">
        <section className="w-full max-w-md rounded-3xl border border-navy-700 bg-navy-900 p-7 sm:p-8 shadow-2xl text-center text-slate-100">
          <Link href="/" className="inline-flex items-center justify-center mb-6" aria-label="AvaliaTech">
            <Logo size="xl" priority />
          </Link>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400">
            <AlertCircle className="h-7 w-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-100">Link inválido ou expirado</h1>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            O link de redefinição de senha não contém os parâmetros necessários ou expirou. Por favor, solicite um novo link.
          </p>
          <div className="mt-6">
            <Link href="/recuperar-senha">
              <Button className="w-full text-xs font-semibold py-2.5">
                Solicitar nova recuperação
              </Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (senha.length < 6) {
      setFormError("A nova senha deve ter no mínimo 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setFormError("As senhas digitadas não coincidem.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          token: token.trim(),
          senha
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao redefinir a senha.");
      }

      setIsSuccess(true);
      showToast("Senha redefinida com sucesso!", "success");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Erro ao redefinir senha.";
      setFormError(msg);
      showToast(msg, "error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-navy-950 p-4 transition">
      {toast && <Toast message={toast.message} type={toast.type} />}

      <section className="w-full max-w-md rounded-3xl border border-navy-700 bg-navy-900 p-7 sm:p-8 shadow-2xl transition text-slate-100">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center transition hover:opacity-90"
            aria-label="AvaliaTech"
          >
            <Logo size="xl" priority />
          </Link>
          <h1 className="mt-6 text-2xl font-black text-slate-100">Redefinir senha</h1>
          <p className="mt-2 text-sm text-slate-400">
            Crie uma nova senha de acesso para sua conta.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-100">Senha alterada com sucesso!</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Você já pode acessar sua conta utilizando a sua nova senha cadastrada.
              </p>
            </div>

            <div className="pt-3">
              <Link href="/login">
                <Button className="w-full gap-2 py-2.5 text-xs font-semibold">
                  <ArrowLeft className="h-4 w-4" /> Ir para o Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {formError && (
              <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-300">
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                <span>{formError}</span>
              </div>
            )}

            <Input
              label="Nova Senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Mínimo de 6 caracteres"
              required
              autoFocus
            />

            <Input
              label="Confirmar Nova Senha"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              placeholder="Digite a senha novamente"
              required
            />

            <Button
              className="w-full gap-2 py-3 text-xs font-semibold"
              type="submit"
              isLoading={isLoading}
            >
              <KeyRound className="h-4 w-4" /> Salvar nova senha
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Cancelar e voltar ao login
              </Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense>
      <RedefinirSenhaContent />
    </Suspense>
  );
}

