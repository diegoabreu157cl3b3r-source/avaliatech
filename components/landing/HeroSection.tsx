import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles, FileText, Shuffle, FileDown } from "lucide-react";
import { ProductMockup } from "@/components/landing/ProductMockup";

export function HeroSection() {
  return (
    <section id="inicio" className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pt-44 lg:pb-36 overflow-hidden">
      {/* Background Gradients & Subtle Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1124330f_1px,transparent_1px),linear-gradient(to_bottom,#1124330f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          {/* Left Column: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1E3448] bg-[#0D1B26] px-3.5 py-1.5 text-xs font-bold tracking-wider uppercase text-[#F5B82E] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#F5B82E] animate-pulse" />
              Da questão ao PDF em poucos cliques
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.12]">
              Crie provas de forma rápida,{" "}
              <span className="text-[#F5B82E] underline decoration-[#F5B82E]/30 decoration-wavy underline-offset-8">
                inteligente
              </span>{" "}
              e{" "}
              <span className="text-[#F5B82E] underline decoration-[#F5B82E]/30 decoration-wavy underline-offset-8">
                profissional
              </span>
              .
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#AAB8C5] leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Organize seu banco de questões, gere avaliações em duas versões e deixe o AvaliaTech cuidar do embaralhamento e dos gabaritos.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/cadastro"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#F5B82E] px-7 py-4 text-base font-bold text-[#07131C] shadow-lg shadow-[#F5B82E]/15 transition hover:bg-[#e5a81f] hover:shadow-[0_0_25px_rgba(245,184,46,0.3)] active:scale-[0.98]"
              >
                Começar agora
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="#como-funciona"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E3448] bg-[#0D1B26] px-6 py-4 text-base font-semibold text-[#F8FAFC] transition hover:bg-[#112433] hover:border-[#F5B82E]/40"
              >
                Ver como funciona
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6 border-t border-[#1E3448]/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#F5B82E] shrink-0" />
                <span>Banco de questões</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#F5B82E] shrink-0" />
                <span>Provas A/B</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#F5B82E] shrink-0" />
                <span>PDF automático</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
                <CheckCircle2 className="h-4 w-4 text-[#F5B82E] shrink-0" />
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

