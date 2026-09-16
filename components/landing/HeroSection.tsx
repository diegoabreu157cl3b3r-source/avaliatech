import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { ProductMockup } from "@/components/landing/ProductMockup";

export function HeroSection() {
  return (
    <section id="inicio" className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background Gradients & Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--navy-800-rgb),0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--navy-800-rgb),0.15)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-navy-700 bg-navy-900 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-gold-400 shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
              Da questão ao PDF em poucos cliques
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-100 leading-[1.15]">
              Crie provas de forma rápida,{" "}
              <span className="text-gold-400 underline decoration-gold-500/30 decoration-wavy underline-offset-8">
                inteligente
              </span>{" "}
              e{" "}
              <span className="text-gold-400 underline decoration-gold-500/30 decoration-wavy underline-offset-8">
                profissional
              </span>
              .
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Organize seu banco de questões, gere avaliações em duas versões e deixe o AvaliaTech cuidar do embaralhamento e dos gabaritos.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/cadastro"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm sm:text-base font-bold text-white dark:text-navy-950 shadow-md shadow-gold-500/15 transition hover:bg-gold-400 active:scale-[0.98]"
              >
                Começar agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#como-funciona"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-navy-700 bg-navy-900 px-5 py-3 text-sm sm:text-base font-semibold text-slate-100 transition hover:bg-navy-850 hover:border-gold-500/40"
              >
                Ver como funciona
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-5 border-t border-navy-700/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                <span>Banco de questões</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                <span>Provas A/B</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                <span>PDF automático</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-gold-400 shrink-0" />
                <span>IA integrada</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Mockup */}
          <div className="lg:col-span-6 pt-4 lg:pt-0">
            <ProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
