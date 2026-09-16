import { Database, Filter, Shuffle, FileDown } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Database,
    title: "Banco de questões",
    description: "Cadastre suas questões ou utilize a IA para criar perguntas inéditas sobre a matéria."
  },
  {
    step: "02",
    icon: Filter,
    title: "Escolha os filtros",
    description: "Selecione disciplina, assuntos, quantidade (10 a 25) e o nível de dificuldade desejado."
  },
  {
    step: "03",
    icon: Shuffle,
    title: "Gere as versões A e B",
    description: "O AvaliaTech embaralha questões e alternativas e recalcula os gabaritos em segundos."
  },
  {
    step: "04",
    icon: FileDown,
    title: "Baixe o PDF",
    description: "Receba o documento diagramado com cabeçalho, espaço do aluno e gabaritos para impressão."
  }
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-20 sm:py-28 bg-navy-900/50 relative border-t border-navy-750/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-gold-400">
            Processo Inteligente
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100">
            Da questão à prova em quatro etapas.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Você não precisa selecionar manualmente questão por questão. Defina as regras da avaliação e o sistema faz o trabalho pesado.
          </p>
        </div>

        {/* Steps Flow */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-4 relative">
          {/* Desktop Connecting Line behind cards */}
          <div className="hidden md:block absolute top-1/3 left-12 right-12 h-0.5 bg-gradient-to-r from-navy-700 via-gold-500/30 to-navy-700 -z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 flex flex-col items-center text-center rounded-2xl border border-navy-750 bg-navy-900 p-5 sm:p-6 transition-all duration-300 hover:border-gold-500/50 hover:bg-navy-850 hover:shadow-lg"
              >
                {/* Step Circle Badge */}
                <div className="relative mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy-850 border border-navy-700 text-gold-400 shadow-sm transition group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-500 text-[10px] font-black text-white dark:text-navy-950 shadow-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="text-sm sm:text-base font-bold text-slate-100">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
