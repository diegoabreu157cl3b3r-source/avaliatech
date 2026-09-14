import { Sparkles, Check, Bot, ArrowRight, Wand2 } from "lucide-react";
import Link from "next/link";

export function AIFeatureSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#07131C] relative border-t border-[#1E3448]/60 overflow-hidden">
      {/* Discreet Violet/Indigo Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#6366f1]/10 via-[#8b5cf6]/10 to-[#F5B82E]/5 rounded-full blur-[100px] pointer-events-none -z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-center">
          {/* Left Column: Copy & Bullet Highlights */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#8b5cf6]/40 bg-[#8b5cf6]/10 px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-[#c4b5fd]">
              <Sparkles className="h-3.5 w-3.5 text-[#F5B82E]" />
              Inteligência Artificial Integrada
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
              Crie questões sem começar do zero.
            </h2>

            <p className="text-base sm:text-lg text-[#AAB8C5] leading-relaxed">
              Descreva o conteúdo, o nível de dificuldade e o tipo de questão que você deseja. O AvaliaTech gera sugestões pedagógicas completas para você revisar e salvar no seu banco.
            </p>

            <ul className="space-y-3 pt-2 text-sm text-[#F8FAFC]">
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#112433] border border-[#1E3448] text-[#F5B82E]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>Sugestões contextualizadas com quatro alternativas objetivas.</span>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#112433] border border-[#1E3448] text-[#F5B82E]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>Controle total de dificuldade: Fácil, Média, Difícil ou <strong>Mista</strong>.</span>
              </li>
              <li className="flex items-center gap-3 justify-center lg:justify-start">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#112433] border border-[#1E3448] text-[#F5B82E]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span>Você sempre revisa e edita antes de qualquer questão entrar no banco.</span>
              </li>
            </ul>

            <div className="pt-4 flex justify-center lg:justify-start">
              <Link
                href="/cadastro"
                className="inline-flex items-center gap-2 rounded-xl bg-[#112433] border border-[#1E3448] px-6 py-3 text-sm font-bold text-[#F8FAFC] transition hover:border-[#F5B82E]/50 hover:text-[#F5B82E]"
              >
                Experimentar gerador de IA <ArrowRight className="h-4 w-4 text-[#F5B82E]" />
              </Link>
            </div>
          </div>

          {/* Right Column: AI Widget Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-[#1E3448] bg-[#0D1B26] p-5 sm:p-7 shadow-2xl shadow-black/80 backdrop-blur-xl relative">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#1E3448] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#6366f1]/30 to-[#8b5cf6]/30 border border-[#8b5cf6]/40 text-[#c4b5fd]">
                    <Wand2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Gerador Inteligente</h4>
                    <p className="text-[10px] text-[#AAB8C5]">Powered by Google Gemini</p>
                  </div>
                </div>
                <span className="rounded-full bg-[#112433] px-2.5 py-0.5 text-[10px] font-bold text-[#F5B82E] border border-[#1E3448]">
                  ✦ Assistente Ativo
                </span>
              </div>

              {/* Mockup Form Body */}
              <div className="mt-4 space-y-3.5 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-[#AAB8C5] mb-1">
                    Instruções para a IA
                  </label>
                  <div className="rounded-xl border border-[#1E3448] bg-[#07131C] p-3 text-[#F8FAFC] font-mono text-[11px] leading-relaxed">
                    &quot;Crie questões sobre Termodinâmica e Leis dos Gases para o 2º ano do Ensino Médio, com situações práticas do cotidiano.&quot;
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#AAB8C5] mb-1">
                      Disciplina
                    </label>
                    <div className="rounded-xl border border-[#1E3448] bg-[#07131C] px-3 py-2 text-[#F8FAFC] font-medium">
                      Física
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#AAB8C5] mb-1">
                      Dificuldade
                    </label>
                    <div className="rounded-xl border border-[#1E3448] bg-[#07131C] px-3 py-2 text-[#F5B82E] font-bold">
                      Mista (Fácil/Média/Difícil)
                    </div>
                  </div>
                </div>

                {/* AI Result Card Snippet */}
                <div className="mt-4 rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3.5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      ✓ Sugestão gerada pela IA
                    </span>
                    <span className="rounded bg-emerald-900/60 px-1.5 py-0.5 text-[9px] font-bold text-emerald-200">
                      Média
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#F8FAFC]">
                    Ao comprimir um gás ideal mantendo a temperatura constante, a pressão aumenta porque:
                  </p>
                  <div className="space-y-1 text-[10px] text-[#AAB8C5]">
                    <p>○ A) As moléculas ganham massa individual.</p>
                    <p className="font-bold text-emerald-300">● B) O número de colisões por área aumenta. (Correta)</p>
                    <p>○ C) A velocidade média das partículas dobra.</p>
                    <p>○ D) O volume total do gás expande.</p>
                  </div>
                </div>

                {/* Simulated Button */}
                <button
                  type="button"
                  disabled
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] py-2.5 text-xs font-bold text-white shadow-md cursor-default opacity-90"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#F5B82E]" />
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

