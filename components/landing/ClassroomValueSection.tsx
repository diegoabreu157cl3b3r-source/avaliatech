import { Clock, ShieldCheck, FileCheck, Award, Printer } from "lucide-react";

export function ClassroomValueSection() {
  return (
    <section id="sobre" className="py-20 sm:py-28 bg-navy-900/40 relative border-t border-navy-750/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-center">
          {/* Left Column: Visual representation of classroom & printed exam */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Paper Stack Composition */}
              <div className="relative rounded-2xl border border-navy-750 bg-navy-900 p-6 sm:p-7 text-slate-100 shadow-xl">
                {/* Paper Header */}
                <div className="flex items-center justify-between border-b border-navy-750 pb-3.5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Material Acadêmico
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-100">
                      Colégio Modelo de Ensino
                    </h4>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-navy-850 text-gold-400 border border-navy-700">
                    <FileCheck className="h-4.5 w-4.5 text-brand-500" />
                  </div>
                </div>

                {/* Simulated Checklist & Efficiency Badge */}
                <div className="mt-4 space-y-2.5 text-xs text-slate-200">
                  <div className="flex items-center justify-between rounded-lg bg-navy-850 p-2.5 border border-navy-750">
                    <span className="flex items-center gap-2 font-medium">
                      <Clock className="h-3.5 w-3.5 text-gold-400" /> Tempo médio economizado
                    </span>
                    <strong className="text-slate-100 font-bold">~45 min / prova</strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-navy-850 p-2.5 border border-navy-750">
                    <span className="flex items-center gap-2 font-medium">
                      <Printer className="h-3.5 w-3.5 text-emerald-500" /> Diagramação pronta
                    </span>
                    <strong className="text-slate-100 font-bold">100% Automática</strong>
                  </div>

                  <div className="flex items-center justify-between rounded-lg bg-navy-850 p-2.5 border border-navy-750">
                    <span className="flex items-center gap-2 font-medium">
                      <ShieldCheck className="h-3.5 w-3.5 text-sky-500" /> Precisão dos Gabaritos
                    </span>
                    <strong className="text-slate-100 font-bold">Recálculo Exato</strong>
                  </div>
                </div>

                {/* Stamp */}
                <div className="mt-5 flex items-center justify-end">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-emerald-500/80 px-2.5 py-1 text-xs font-bold uppercase text-emerald-600 dark:text-emerald-400 -rotate-2">
                    <Award className="h-3.5 w-3.5" /> Pronto para Sala de Aula
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Copy & Emotional Narrative */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left order-1 lg:order-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-gold-400">
              Pensado para a Sala de Aula
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100 leading-tight">
              Mais tempo para ensinar. Menos tempo preparando provas.
            </h2>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              O AvaliaTech automatiza as tarefas repetitivas da criação de avaliações para que o professor possa concentrar sua energia no que realmente importa: o aprendizado de seus alunos.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 text-left">
              <div className="rounded-xl border border-navy-750 bg-navy-900 p-3.5">
                <p className="font-bold text-slate-100 text-xs sm:text-sm">Fim do retrabalho manual</p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Nunca mais gaste horas recortando e colando alternativas no Word ou refazendo gabarito à mão.
                </p>
              </div>

              <div className="rounded-xl border border-navy-750 bg-navy-900 p-3.5">
                <p className="font-bold text-slate-100 text-xs sm:text-sm">Organização por anos</p>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
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
