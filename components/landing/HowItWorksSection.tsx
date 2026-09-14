import { Database, Filter, Shuffle, FileDown, ArrowRight } from "lucide-react";

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
    <section id="como-funciona" className="py-24 sm:py-32 bg-[#091722] relative border-t border-[#1E3448]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1E3448] bg-[#0D1B26] px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-[#F5B82E]">
            Processo Inteligente
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            Da questão à prova em quatro etapas.
          </h2>
          <p className="text-base sm:text-lg text-[#AAB8C5] leading-relaxed">
            Você não precisa selecionar manualmente questão por questão. Defina as regras da avaliação e o sistema faz o trabalho pesado.
          </p>
        </div>

        {/* Steps Flow (Horizontal on desktop, vertical on mobile) */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-4 relative">
          {/* Desktop Connecting Line behind cards */}
          <div className="hidden md:block absolute top-1/3 left-12 right-12 h-0.5 bg-gradient-to-r from-[#1E3448] via-[#F5B82E]/40 to-[#1E3448] -z-0" />

          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative z-10 flex flex-col items-center text-center rounded-2xl border border-[#1E3448] bg-[#0D1B26] p-6 sm:p-7 transition-all duration-300 hover:border-[#F5B82E]/50 hover:bg-[#112433] hover:shadow-xl shadow-black/40"
              >
                {/* Step Circle Badge */}
                <div className="relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#112433] border border-[#1E3448] text-[#F5B82E] shadow-md transition group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#F5B82E] text-[11px] font-black text-[#07131C] shadow-sm">
                    {index + 1}
                  </span>
                </div>

                {/* Step Content */}
                <h3 className="text-lg font-bold text-[#F8FAFC]">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[#AAB8C5]">
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

