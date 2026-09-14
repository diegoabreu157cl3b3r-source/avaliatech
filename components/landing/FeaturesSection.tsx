import {
  Database,
  Layers,
  Shuffle,
  CheckCircle2,
  Sparkles,
  FileDown
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Database,
    title: "Banco de Questões",
    description:
      "Cadastre, edite, pesquise e organize suas questões por disciplina, assunto e dificuldade em um catálogo centralizado."
  },
  {
    number: "02",
    icon: Layers,
    title: "Geração de Provas",
    description:
      "Monte avaliações automaticamente a partir dos filtros escolhidos, com distribuição equilibrada ou personalizada."
  },
  {
    number: "03",
    icon: Shuffle,
    title: "Duas Versões (A e B)",
    description:
      "Gere versões A e B com questões e alternativas embaralhadas para prevenir cópias e garantir rigor acadêmico."
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Gabarito Automático",
    description:
      "O sistema recalcula o gabarito de cada versão após o embaralhamento, entregando a folha de correção sem erros manuais."
  },
  {
    number: "05",
    icon: Sparkles,
    title: "IA Integrada",
    description:
      "Gere questões completas e contextualizadas com inteligência artificial, revise cada alternativa e salve no seu banco."
  },
  {
    number: "06",
    icon: FileDown,
    title: "PDF Profissional",
    description:
      "Gere a avaliação diagramada em 10 questões por página e os dois gabaritos em padrão gráfico pronto para impressão."
  }
];

export function FeaturesSection() {
  return (
    <section id="recursos" className="py-24 sm:py-32 bg-[#07131C] relative border-t border-[#1E3448]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1E3448] bg-[#0D1B26] px-3.5 py-1 text-xs font-bold tracking-wider uppercase text-[#F5B82E]">
            Recursos Principais
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F8FAFC]">
            Tudo o que você precisa para criar avaliações melhores.
          </h2>
          <p className="text-base sm:text-lg text-[#AAB8C5] leading-relaxed">
            Do banco de questões à prova pronta para impressão, o AvaliaTech reúne as principais etapas da criação de uma avaliação em um só lugar.
          </p>
        </div>

        {/* Features Grid: 3x2 on desktop */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.number}
                className="group relative rounded-2xl border border-[#1E3448] bg-[#0D1B26] p-7 transition-all duration-300 hover:border-[#F5B82E]/50 hover:bg-[#112433] hover:shadow-xl hover:shadow-black/40 flex flex-col justify-between"
              >
                {/* Top: Icon + Number */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#112433] border border-[#1E3448] text-[#F5B82E] transition group-hover:scale-110 group-hover:border-[#F5B82E]/40 group-hover:bg-[#0D1B26]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="font-mono text-2xl font-black text-[#1E3448] group-hover:text-[#F5B82E]/40 transition">
                      {feature.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="mt-6 text-xl font-bold text-[#F8FAFC] group-hover:text-white transition">
                    {feature.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#AAB8C5]">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle bottom accent line */}
                <div className="mt-6 pt-4 border-t border-[#1E3448]/50 flex items-center justify-between text-xs font-semibold text-[#AAB8C5] group-hover:text-[#F5B82E] transition">
                  <span>Saiba mais</span>
                  <span className="opacity-0 group-hover:opacity-100 transition duration-300">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

