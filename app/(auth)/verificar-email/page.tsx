"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/ui/Logo";
import { Toast } from "@/components/ui/Toast";
import { useToast } from "@/hooks/useToast";
import { http } from "@/services/http";
import type { ApiResponse } from "@/types/api";

function VerificationContent() {
const router = useRouter();
const searchParams = useSearchParams();
const { toast, showToast } = useToast();

const [email, setEmail] = useState(
searchParams.get("email") ?? ""
);
const [codigo, setCodigo] = useState("");
const [isLoading, setIsLoading] = useState(false);
const [isResending, setIsResending] = useState(false);

async function handleVerify(event: React.FormEvent<HTMLFormElement>) {
event.preventDefault();

if (!/^\d{6}$/.test(codigo)) {
  showToast("Digite o código de seis números.", "error");
  return;
}

setIsLoading(true);

try {
  await http<ApiResponse<{ verified: boolean }>>(
    "/api/auth/verify-email",
    {
      method: "POST",
      body: JSON.stringify({ email, codigo })
    }
  );

  showToast("E-mail confirmado com sucesso!", "success");

  setTimeout(() => {
    router.push("/login");
  }, 1000);
} catch (error) {
  showToast(
    error instanceof Error
      ? error.message
      : "Não foi possível confirmar o e-mail.",
    "error"
  );
} finally {
  setIsLoading(false);
}

}

async function handleResend() {
if (!email.trim()) {
showToast("Informe seu e-mail primeiro.", "error");
return;
}

setIsResending(true);

try {
  const response = await http<
    ApiResponse<{ requested: boolean }>
  >("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email })
  });

  showToast(
    response.message ?? "Confira sua caixa de entrada.",
    "success"
  );
} catch (error) {
  showToast(
    error instanceof Error
      ? error.message
      : "Não foi possível reenviar o código.",
    "error"
  );
} finally {
  setIsResending(false);
}

}

return (
<main className="flex min-h-screen items-center justify-center bg-navy-950 p-4">
{toast && (
<Toast message={toast.message} type={toast.type} />
)}

  <section className="w-full max-w-md rounded-3xl border border-navy-700 bg-navy-900 p-7 text-slate-100 shadow-2xl sm:p-8">
    <div className="mb-7 text-center">
      <Link
        href="/"
        className="inline-flex justify-center hover:opacity-90"
        aria-label="AvaliaTech"
      >
        <Logo size="xl" priority />
      </Link>

      <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/10">
        <MailCheck className="h-8 w-8 text-gold-400" />
      </div>

      <h1 className="mt-5 text-2xl font-black">
        Confirme seu e-mail
      </h1>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        Enviamos um código de seis dígitos para seu endereço
        de e-mail. Digite-o abaixo para ativar sua conta.
      </p>
    </div>

    <form className="space-y-4" onSubmit={handleVerify}>
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="professor@email.com"
        required
      />

      <Input
        label="Código de confirmação"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={codigo}
        onChange={(event) =>
          setCodigo(event.target.value.replace(/\D/g, "").slice(0, 6))
        }
        placeholder="000000"
        className="text-center text-xl font-bold tracking-[0.4em]"
        required
      />

      <Button
        className="w-full py-3"
        type="submit"
        isLoading={isLoading}
      >
        <ShieldCheck className="mr-2 h-4 w-4" />
        Confirmar e-mail
      </Button>
    </form>

    <div className="mt-5 rounded-2xl border border-navy-700 bg-navy-950/60 p-4">
      <p className="text-sm text-slate-300">
        Não recebeu o código?
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        Confira a caixa de spam e aguarde antes de solicitar
        outro código.
      </p>

      <Button
        type="button"
        variant="secondary"
        className="mt-3 w-full"
        onClick={handleResend}
        isLoading={isResending}
      >
        Reenviar código
      </Button>
    </div>

    <p className="mt-6 text-center text-sm text-slate-400">
      Já confirmou?{" "}
      <Link
        href="/login"
        className="font-bold text-gold-400 hover:text-gold-300 hover:underline"
      >
        Fazer login
      </Link>
    </p>
  </section>
</main>

);
}

export default function VerificarEmailPage() {
return (
<Suspense>
<VerificationContent />
</Suspense>
);
}