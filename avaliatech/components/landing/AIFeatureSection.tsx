import { Sparkles, Check, ArrowRight, Wand2 } from "lucide-react";
import Link from "next/link";

export function AIFeatureSection() {
  return (
    <section id="ia" className="py-20 sm:py-28 bg-navy-950 relative border-t border-navy-750/80 overflow-hidden">
      {/* Discreet Violet/Indigo Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-[#6366f1]/10 via-[#8b5cf6]/10 to-gold-500/5 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10 items-center">
          {/* Left Column: Copy & Bullet Highlights */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/40 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-indigo-400 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5 text-gold-400" />
              Inteligência Artificial Integrada
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight">
              Crie questões sem começar do zero.
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Descreva o conteúdo, o nível de dificuldade e o tipo de questão que você deseja. O AvaliaTech gera sugestões pedagógicas completas para você revisar e salvar no seu banco.
            </p>

            <ul className="space-y-2.5 pt-1 text-xs sm:text-sm text-slate-200">
              <li className="flex items-center gap-2.5 justify-center lg:justify-start">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-850 border border-navy-700 text-gold-400">
                  <Check className="h-3 w-3" />
                </span>
                <span>Sugestões contextualizadas com quatro alternativas objetivas.</span>
              </li>
              <li className="flex items-center gap-2.5 justify-center lg:justify-start">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-850 border border-navy-700 text-gold-400">
                  <Check className="h-3 w-3" />
                </span>
                <span>Controle total de dificuldade: Fácil, Média, Difícil ou <strong>Mista</strong>.</span>
              </li>
              <li className="flex items-center gap-2.5 justify-center lg:justify-start">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-navy-850 border border-navy-700 text-gold-400">
                  <Check className="h-3 w-3" />
                </span>
                <span>Você sempre revisa e edita antes de qualquer questão entrar no banco.</span>
              </li>
            </ul>

            <div className="pt-3 flex justify-center lg:justify-start">
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 rounded-xl bg-navy-850 border border-navy-700 px-5 py-2.5 text-sm font-semibold text-slate-100 transition hover:border-gold-500/50 hover:text-gold-400"
              >
                Experimentar gerador de IA <ArrowRight className="h-3.5 w-3.5 text-gold-400" />
              </Link>
            </div>
          </div>

          {/* Right Column: AI Widget Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-navy-750 bg-navy-900 p-5 sm:p-6 shadow-xl relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-navy-750 pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-400">
                    <Wand2 className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">Gerador Inteligente</h4>
                    <p className="text-[10px] text-slate-400">Powered by Google Gemini</p>
                  </div>
                </div>
                <span className="rounded-full bg-navy-850 px-2.5 py-0.5 text-[10px] font-semibold text-gold-400 border border-navy-750">
                  ✦ Assistente Ativo
                </span>
              </div>

              {/* Mockup Form Body */}
              <div className="mt-3.5 space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Instruções para a IA
                  </label>
                  <div className="rounded-xl border border-navy-700 bg-navy-850 p-2.5 text-slate-100 font-mono text-[11px] leading-relaxed">
                    &quot;Crie questões sobre Termodinâmica e Leis dos Gases para o 2º ano do Ensino Médio, com situações práticas do cotidiano.&quot;
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Disciplina
                    </label>
                    <div className="rounded-xl border border-navy-700 bg-navy-850 px-3 py-2 text-slate-100 font-medium">
                      Física
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Dificuldade
                    </label>
                    <div className="rounded-xl border border-navy-700 bg-navy-850 px-3 py-2 text-gold-400 font-bold">
                      Mista (Fácil/Média/Difícil)
                    </div>
                  </div>
                </div>

                {/* AI Result Card Snippet */}
                <div className="mt-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      ✓ Sugestão gerada pela IA
                    </span>
                    <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-200">
                      Média
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-100">
                    Ao comprimir um gás ideal mantendo a temperatura constante, a pressão aumenta porque:
                  </p>
                  <div className="space-y-0.5 text-[10px] text-slate-400">
                    <p>○ A) As moléculas ganham massa individual.</p>
                    <p className="font-bold text-emerald-600 dark:text-emerald-300">● B) O número de colisões por área aumenta. (Correta)</p>
                    <p>○ C) A velocidade média das partículas dobra.</p>
                    <p>○ D) O volume total do gás expande.</p>
                  </div>
                </div>

                {/* Simulated Button */}
                <button
                  type="button"
                  disabled
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 py-2 text-xs font-bold text-white shadow-sm cursor-default opacity-90"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold-300" />
                  Gerar novas questões
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
