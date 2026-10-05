"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";

export default function RecuperarSenhaPage() {
  const { toast, showToast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erro ao solicitar recuperação de senha.");
      }

      setIsSuccess(true);
    } catch (error) {
      showToast(
        error instanceof Error ? error.message : "Erro ao enviar solicitação.",
        "error"
      );
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
          <h1 className="mt-6 text-2xl font-black text-slate-100">Recuperar senha</h1>
          <p className="mt-2 text-sm text-slate-400">
            Informe seu e-mail cadastrado para enviarmos as instruções de recuperação.
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-5 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="h-7 w-7" />
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-bold text-slate-100">E-mail de recuperação enviado</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Se o e-mail <strong className="text-gold-400">{email}</strong> estiver cadastrado em nossa base, você receberá um link com validade de 1 hora para redefinir sua senha.
              </p>
              <p className="text-[11px] text-slate-400">
                Não se esqueça de verificar também sua pasta de spam ou lixo eletrônico.
              </p>
            </div>

            <div className="pt-3">
              <Link href="/login">
                <Button className="w-full gap-2 py-2.5 text-xs font-semibold">
                  <ArrowLeft className="h-4 w-4" /> Voltar para o Login
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            <Input
              label="E-mail cadastrado"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@escola.com"
              required
              autoFocus
            />

            <Button
              className="w-full gap-2 py-3 text-xs font-semibold"
              type="submit"
              isLoading={isLoading}
            >
              <Mail className="h-4 w-4" /> Enviar link de recuperação
            </Button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Voltar para o login
              </Link>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

