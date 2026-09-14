import { Clock, ShieldCheck, FileCheck, CheckCircle2, Award, Printer } from "lucide-react";

export function ClassroomValueSection() {
  return (
    <section id="sobre" className="py-24 sm:py-32 bg-[#091722] relative border-t border-[#1E3448]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Visual representation of classroom & printed exam */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Paper Stack Composition */}
              <div className="relative rounded-2xl border border-slate-300 bg-[#FAFBFD] p-6 sm:p-8 text-slate-900 shadow-2xl shadow-black/80">
                {/* Paper Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      Material Acadêmico
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      Colégio Modelo de Ensino
                    </h4>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                    <FileCheck className="h-5 w-5 text-[#0c87eb]" />
                  </div>
                </div>

                {/* Simulated Checklist & Efficiency Badge */}
                <div className="mt-5 space-y-3 text-xs text-slate-700">
                  <div className="flex items-center justify-between rounded-lg bg-slate-100/80 p-3">
                    <span className="flex items-center gap-2 font-semibold">
                      <Clock className="h-4 w-4 text-[#F5B82E]" /> Tempo médio economizado
                    </span>
                    <strong className="text-slate-900 font-black">~45 min / prova</strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-100/80 p-3">
                    <span className="flex items-center gap-2 font-semibold">
                      <Printer className="h-4 w-4 text-emerald-600" /> Diagramação pronta
                    </span>
                    <strong className="text-slate-900 font-black">100% Automática</strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-slate-100/80 p-3">
                    <span className="flex items-center gap-2 font-semibold">
                      <ShieldCheck className="h-4 w-4 text-sky-600" /> Precisão dos Gabaritos
                    </span>
                    <strong className="text-slate-900 font-black">Recálculo Exato</strong>
                  </div>
                </div>

                {/* Stamp */}
                <div className="mt-6 flex items-center justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border-2 border-dashed border-emerald-600/80 px-3 py-1.5 text-xs font-black uppercase text-emerald-700 -rotate-3">
                    <Award className="h-4 w-4" /> Pronto para Sala de Aula
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Emotional Narrative */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left order-1 lg:order-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1E3448] bg-[#0D1B26] px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-[#F5B82E]">
              Pensado para a Sala de Aula
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
              Mais tempo para ensinar. Menos tempo preparando provas.
            </h2>

            <p className="text-base sm:text-lg text-[#AAB8C5] leading-relaxed">
              O AvaliaTech automatiza as tarefas repetitivas da criação de avaliações para que o professor possa concentrar sua energia no que realmente importa: o aprendizado de seus alunos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-left">
              <div className="rounded-xl border border-[#1E3448] bg-[#0D1B26] p-4">
                <p className="font-bold text-[#F8FAFC] text-sm">Fim do retrabalho manual</p>
                <p className="mt-1 text-xs text-[#AAB8C5] leading-relaxed">
                  Nunca mais gaste horas recortando e colando alternativas no Word ou refazendo gabarito à mão.
                </p>
              </div>

              <div className="rounded-xl border border-[#1E3448] bg-[#0D1B26] p-4">
                <p className="font-bold text-[#F8FAFC] text-sm">Organização por anos</p>
                <p className="mt-1 text-xs text-[#AAB8C5] leading-relaxed">
                  Seu acervo de questões e histórico de provas permanecem organizados para uso contínuo em novos anos letivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

