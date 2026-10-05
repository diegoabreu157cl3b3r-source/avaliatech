import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="py-16 sm:py-24 bg-navy-950 relative border-t border-navy-750/80 overflow-hidden">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gold-500/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-gold-400">
          <Sparkles className="h-3.5 w-3.5" />
          Pronto para transformar suas avaliações?
        </span>

        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100 max-w-3xl mx-auto">
          Sua próxima avaliação pode começar agora.
        </h2>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Organize suas questões, gere duas versões com embaralhamento inteligente e tenha sua prova e gabaritos prontos para impressão em poucos minutos.
        </p>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/cadastro"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gold-500 px-6 py-3 text-sm sm:text-base font-bold text-white dark:text-navy-950 shadow-md shadow-gold-500/15 transition hover:bg-gold-400 active:scale-[0.98]"
          >
            Começar agora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-navy-700 bg-navy-900 px-5 py-3 text-sm sm:text-base font-semibold text-slate-100 transition hover:bg-navy-850 hover:border-gold-500/40"
          >
            Já tenho uma conta
          </Link>
        </div>
      </div>
    </section>
  );
}
