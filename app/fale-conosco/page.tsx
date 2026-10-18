"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, LoaderCircle, Mail, MessageSquareText } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

type ContactForm = { name: string; email: string; subject: string; category: string; message: string; website: string };
const initialForm: ContactForm = { name: "", email: "", subject: "", category: "Dúvida sobre a plataforma", message: "", website: "" };

export default function FaleConoscoPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");
  const [returnHref, setReturnHref] = useState("/");

  useEffect(() => {
    let cancelled = false;

    async function detectSession() {
      // Detecta a sessão real, independentemente de como a página foi aberta.
      // Assim, abrir pelo menu do painel não manda o professor para a tela pública.
      try {
        const response = await fetch("/api/auth/me", {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!cancelled) {
          setReturnHref(response.ok ? "/dashboard" : "/");
        }
      } catch {
        if (!cancelled) setReturnHref("/");
      }
    }

    detectSession();
    return () => {
      cancelled = true;
    };
  }, []);
  function update<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.");
      setStatus("success");
      setFeedback("Mensagem enviada com sucesso! Obrigado por entrar em contato com o AvaliaTech.");
      setForm(initialForm);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Não foi possível enviar sua mensagem agora. Tente novamente mais tarde.");
    }
  }
  const fieldClass = "field";
  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 transition-colors">
      <header className="border-b border-navy-750 bg-navy-900/90"><div className="container-app flex h-16 items-center justify-between"><Link href={returnHref} aria-label={returnHref === "/dashboard" ? "Voltar ao painel do AvaliaTech" : "AvaliaTech - página inicial"}><Logo size="md" /></Link><Link href="/sobre-nos" className="text-sm font-semibold text-slate-400 transition hover:text-gold-400">Sobre nós</Link></div></header>
      <div className="container-app grid gap-8 py-10 sm:py-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
        <section className="pt-2">
          <Link href={returnHref} className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-gold-400"><ArrowLeft className="h-4 w-4" /> {returnHref === "/dashboard" ? "Voltar ao painel" : "Voltar ao início"}</Link>
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-400"><Mail className="h-6 w-6" /></div>
          <h1 className="text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">Fale conosco</h1>
          <p className="mt-4 max-w-md text-sm leading-7 text-slate-400 sm:text-base">Tem alguma dúvida, encontrou um problema ou quer sugerir uma melhoria? Envie uma mensagem. Vamos ler com atenção e usar seu e-mail para responder.</p>
          <div className="mt-7 flex items-start gap-3 rounded-2xl border border-navy-750 bg-navy-900 p-4"><MessageSquareText className="mt-0.5 h-5 w-5 shrink-0 text-gold-400" /><div><p className="text-sm font-semibold text-slate-200">Sua opinião importa</p><p className="mt-1 text-xs leading-5 text-slate-500">Não inclua senhas nem informações pessoais sensíveis na mensagem.</p></div></div>
        </section>
        <section className="rounded-2xl border border-navy-750 bg-navy-900 p-5 shadow-xl shadow-black/5 sm:p-8">
          {status === "success" ? <div className="flex min-h-80 flex-col items-center justify-center text-center"><CheckCircle2 className="h-12 w-12 text-emerald-500" /><h2 className="mt-4 text-xl font-bold text-slate-100">Mensagem enviada!</h2><p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">{feedback}</p><button type="button" onClick={() => { setStatus("idle"); setFeedback(""); }} className="mt-6 rounded-xl border border-navy-700 px-4 py-2.5 text-sm font-semibold transition hover:border-gold-500/50 hover:text-gold-400">Enviar outra mensagem</button></div> : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="contact-name" className="label normal-case tracking-normal text-sm">Nome completo</label><input id="contact-name" className={fieldClass} value={form.name} onChange={(e) => update("name", e.target.value)} autoComplete="name" minLength={2} maxLength={100} required placeholder="Como podemos te chamar?" /></div><div><label htmlFor="contact-email" className="label normal-case tracking-normal text-sm">Seu e-mail</label><input id="contact-email" className={fieldClass} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} autoComplete="email" maxLength={254} required placeholder="voce@exemplo.com" /></div></div>
              <div><label htmlFor="contact-category" className="label normal-case tracking-normal text-sm">Motivo do contato</label><select id="contact-category" className={fieldClass} value={form.category} onChange={(e) => update("category", e.target.value)}><option>Dúvida sobre a plataforma</option><option>Problema técnico</option><option>Sugestão de melhoria</option><option>Relato de erro</option><option>Outro assunto</option></select></div>
              <div><label htmlFor="contact-subject" className="label normal-case tracking-normal text-sm">Assunto</label><input id="contact-subject" className={fieldClass} value={form.subject} onChange={(e) => update("subject", e.target.value)} minLength={3} maxLength={120} required placeholder="Resuma o motivo da mensagem" /></div>
              <div><label htmlFor="contact-message" className="label normal-case tracking-normal text-sm">Mensagem</label><textarea id="contact-message" className={fieldClass + " min-h-36 resize-y"} value={form.message} onChange={(e) => update("message", e.target.value)} minLength={10} maxLength={4000} required placeholder="Conte um pouco mais para que possamos ajudar..." /><p className="mt-1 text-right text-xs text-slate-500">{form.message.length}/4000</p></div>
              <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"><label htmlFor="contact-website">Deixe este campo vazio</label><input id="contact-website" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} /></div>
              {status === "error" && <p role="alert" className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">{feedback}</p>}
              <button type="submit" disabled={status === "loading"} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 font-bold text-white transition hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-navy-950">{status === "loading" ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Enviando...</> : <>Enviar mensagem <Mail className="h-4 w-4" /></>}</button>
              <p className="text-center text-xs leading-5 text-slate-500">Usaremos os dados informados apenas para responder ao seu contato.</p>
            </form>
          )}
        </section>
      </div>
      <footer className="border-t border-navy-750 py-6"><div className="container-app flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row"><p>© {new Date().getFullYear()} AvaliaTech</p><Link href="/sobre-nos" className="hover:text-gold-400">Conheça o projeto</Link></div></footer>
    </main>
  );
}
