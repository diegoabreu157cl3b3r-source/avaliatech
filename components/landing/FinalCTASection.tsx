import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 bg-[#07131C] relative border-t border-[#1E3448]/60 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#F5B82E]/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1E3448] bg-[#0D1B26] px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-[#F5B82E]">
          <Sparkles className="h-3.5 w-3.5" />
          Pronto para transformar suas avaliações?
        </span>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] max-w-3xl mx-auto">
          Sua próxima avaliação pode começar agora.
        </h2>

        <p className="text-base sm:text-lg text-[#AAB8C5] leading-relaxed max-w-2xl mx-auto">
          Organize suas questões, gere duas versões com embaralhamento inteligente e tenha sua prova e gabaritos prontos para impressão em poucos minutos.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/cadastro"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#F5B82E] px-8 py-4 text-base font-bold text-[#07131C] shadow-lg shadow-[#F5B82E]/20 transition hover:bg-[#e5a81f] hover:shadow-[0_0_30px_rgba(245,184,46,0.35)] active:scale-[0.98]"
          >
            Começar agora
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E3448] bg-[#0D1B26] px-7 py-4 text-base font-semibold text-[#F8FAFC] transition hover:bg-[#112433] hover:border-[#F5B82E]/40"
          >
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </section>
  );
}

