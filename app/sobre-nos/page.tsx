"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpenCheck, BrainCircuit, FileCheck2, Layers3, Target, UsersRound } from "lucide-react";
import { Logo } from "@/components/ui/Logo";


const features = [
  { icon: BookOpenCheck, title: "Banco de questões", text: "Organize suas questões por disciplina, assunto e dificuldade." },
  { icon: Layers3, title: "Versões A e B", text: "Monte avaliações com questões e alternativas reorganizadas automaticamente." },
  { icon: FileCheck2, title: "Provas em PDF", text: "Exporte avaliações e gabaritos organizados para impressão." },
  { icon: BrainCircuit, title: "Recursos inteligentes", text: "Aproveite os recursos de inteligência artificial disponíveis na plataforma como apoio à preparação das avaliações." }
];

export default function SobreNosPage() {
  // Esta página também é pública, então não pode depender do AuthProvider.
  // Consultamos a sessão diretamente para funcionar tanto antes quanto depois do login.
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/auth/me", { cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((json) => {
        if (active) setIsLoggedIn(Boolean(json?.data?.user));
      })
      .catch(() => {
        if (active) setIsLoggedIn(false);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, []);

  const homeHref = isLoggedIn ? "/dashboard" : "/";
  return (
    <main className="min-h-screen bg-navy-950 text-slate-100 transition-colors">
      <header className="border-b border-navy-750 bg-navy-900/90">
        <div className="container-app flex h-16 items-center justify-between">
          <div className="flex items-center"><Link href={homeHref} aria-label={isLoggedIn ? "AvaliaTech - voltar ao painel" : "AvaliaTech - página inicial"}><Logo size="md" theme="dark" /></Link></div>
          <Link href="/fale-conosco" className="inline-flex items-center gap-2 rounded-xl bg-gold-500 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-gold-400 dark:text-navy-950">Fale conosco <ArrowRight className="h-4 w-4" /></Link>
        </div>
      </header>
      <section className="relative overflow-hidden border-b border-navy-750">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-500/10 blur-3xl" />
        <div className="container-app relative py-16 sm:py-24">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-gold-400"><span className="h-1.5 w-1.5 rounded-full bg-gold-400" /> Nossa história e propósito</p>
          <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight text-slate-100 sm:text-5xl lg:text-6xl">Tecnologia para deixar mais leve a rotina de quem <span className="text-gold-400">ensina.</span></h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">O AvaliaTech é uma plataforma criada para ajudar professores a organizar questões e preparar avaliações de maneira prática, consistente e profissional.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href={isLoggedIn ? "/dashboard" : "/cadastro"} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 font-bold text-white transition hover:bg-gold-400 dark:text-navy-950">{isLoading ? "Carregando..." : isLoggedIn ? "Voltar ao painel" : "Conheça a plataforma"} <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/fale-conosco" className="inline-flex items-center justify-center rounded-xl border border-navy-700 px-5 py-3 font-semibold text-slate-200 transition hover:border-gold-500/50 hover:text-gold-400">Entre em contato</Link>
          </div>
        </div>
      </section>
      <section className="container-app grid gap-10 py-14 sm:py-20 md:grid-cols-[0.8fr_1.2fr] md:items-start">
        <div><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-gold-500/25 bg-gold-500/10 text-gold-400"><UsersRound className="h-6 w-6" /></div><h2 className="text-2xl font-bold text-slate-100 sm:text-3xl">Como tudo começou</h2></div>
        <div className="space-y-4 text-sm leading-7 text-slate-400 sm:text-base">
          <p>O AvaliaTech nasceu de uma ideia simples: usar a tecnologia para reduzir o trabalho repetitivo envolvido na preparação de provas e ajudar a manter as questões organizadas.</p>
          <p>Em vez de espalhar perguntas por vários arquivos e montar cada avaliação do zero, a proposta é reunir esse processo em um só lugar. O professor organiza seu banco de questões, define os critérios da prova e deixa a plataforma cuidar da montagem das versões e dos gabaritos.</p>
          <p>O projeto continua evoluindo com foco nas necessidades reais de quem ensina. A ideia é construir uma ferramenta útil, acessível e cada vez mais prática, sem perder de vista que o professor continua no centro das decisões pedagógicas.</p>
        </div>
      </section>
      <section className="border-y border-navy-750 bg-navy-900/50">
        <div className="container-app grid gap-5 py-12 sm:grid-cols-2 sm:py-16">
          <article className="rounded-2xl border border-navy-750 bg-navy-900 p-6 sm:p-8"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400"><Target className="h-5 w-5" /></div><h2 className="text-xl font-bold text-slate-100">Nossa missão</h2><p className="mt-3 text-sm leading-7 text-slate-400">Facilitar a criação, a organização e a preparação de avaliações com ferramentas digitais que economizem etapas repetitivas e apoiem o trabalho docente.</p></article>
          <article className="rounded-2xl border border-navy-750 bg-navy-900 p-6 sm:p-8"><div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400"><BookOpenCheck className="h-5 w-5" /></div><h2 className="text-xl font-bold text-slate-100">Nossa visão</h2><p className="mt-3 text-sm leading-7 text-slate-400">Evoluir continuamente a plataforma ouvindo quem a utiliza, com atenção à praticidade, à organização, à segurança e às diferentes rotinas escolares.</p></article>
        </div>
      </section>
      <section className="container-app py-14 sm:py-20">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-gold-400">Feito para a rotina docente</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-100 sm:text-4xl">O que você encontra no AvaliaTech</h2><p className="mt-4 leading-7 text-slate-400">Recursos pensados para reunir etapas importantes da preparação de avaliações em um fluxo organizado.</p></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon: Icon, title, text }) => <article key={title} className="rounded-2xl border border-navy-750 bg-navy-900 p-5 transition hover:-translate-y-0.5 hover:border-gold-500/40"><div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500/10 text-gold-400"><Icon className="h-5 w-5" /></div><h3 className="font-bold text-slate-100">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div>
      </section>
      <section className="container-app pb-16 sm:pb-20"><div className="flex flex-col gap-5 rounded-3xl border border-gold-500/20 bg-gradient-to-br from-gold-500/10 to-navy-900 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-9"><div><h2 className="text-2xl font-bold text-slate-100">Vamos conversar?</h2><p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">Dúvidas, sugestões e ideias ajudam o AvaliaTech a continuar evoluindo.</p></div><Link href="/fale-conosco" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gold-500 px-5 py-3 font-bold text-white transition hover:bg-gold-400 dark:text-navy-950">Fale conosco <ArrowRight className="h-4 w-4" /></Link></div></section>
      <footer className="border-t border-navy-750 py-6"><div className="container-app flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row"><Link href={homeHref} className="hover:text-gold-400"><Logo size="sm" theme="dark" /></Link><p>© {new Date().getFullYear()} AvaliaTech. Todos os direitos reservados.</p><Link href="/fale-conosco" className="hover:text-gold-400">Fale conosco</Link></div></footer>
    </main>
  );
}
