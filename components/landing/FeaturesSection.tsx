import Link from "next/link";
import {
  Database,
  Layers,
  Shuffle,
  CheckCircle2,
  Sparkles,
  FileDown,
  ArrowRight
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Database,
    title: "Banco de Questões",
    href: "#como-funciona",
    description:
      "Cadastre, edite, pesquise e organize suas questões por disciplina, assunto e dificuldade em um catálogo centralizado."
  },
  {
    number: "02",
    icon: Layers,
    title: "Geração de Provas",
    href: "#como-funciona",
    description:
      "Monte avaliações automaticamente a partir dos filtros escolhidos, com distribuição equilibrada ou personalizada."
  },
  {
    number: "03",
    icon: Shuffle,
    title: "Duas Versões (A e B)",
    href: "#como-funciona",
    description:
      "Gere versões A e B com questões e alternativas embaralhadas para prevenir cópias e garantir rigor acadêmico."
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Gabarito Automático",
    href: "#como-funciona",
    description:
      "O sistema recalcula o gabarito de cada versão após o embaralhamento, entregando a folha de correção sem erros manuais."
  },
  {
    number: "05",
    icon: Sparkles,
    title: "IA Integrada",
    href: "#ia",
    highlight: true,
    description:
      "Gere questões completas e contextualizadas com inteligência artificial, revise cada alternativa e salve no seu banco."
  },
  {
    number: "06",
    icon: FileDown,
    title: "PDF Profissional",
    href: "#como-funciona",
    description:
      "Gere a avaliação diagramada em 10 questões por página e os dois gabaritos em padrão gráfico pronto para impressão."
  }
];

export function FeaturesSection() {
  return (
    <section id="recursos" className="py-20 sm:py-28 bg-navy-950 relative border-t border-navy-750/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3.5">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-700 bg-navy-900 px-3.5 py-1 text-xs font-semibold tracking-wider uppercase text-gold-400">
            Recursos Principais
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-100">
            Tudo o que você precisa para criar avaliações melhores.
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Do banco de questões à prova pronta para impressão, o AvaliaTech reúne as principais etapas da criação de uma avaliação em um só lugar.
          </p>
        </div>

        {/* Features Grid: 3x2 on desktop */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.number}
                href={feature.href}
                className={`group relative rounded-2xl border bg-navy-900 p-6 transition-all duration-300 hover:bg-navy-850 hover:shadow-lg flex flex-col justify-between cursor-pointer ${
                  feature.highlight
                    ? "border-gold-500/60 shadow-xs hover:border-gold-500"
                    : "border-navy-750 hover:border-gold-500/50"
                }`}
              >
                {/* Top: Icon + Number */}
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-850 border border-navy-700 text-gold-400 transition group-hover:scale-105 group-hover:border-gold-500/40">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xl font-black text-navy-700 group-hover:text-gold-400/40 transition">
                      {feature.number}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className={`mt-5 text-base sm:text-lg font-bold transition ${
                    feature.highlight ? "text-gold-400" : "text-slate-100 group-hover:text-gold-400"
                  }`}>
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-400">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle bottom action line */}
                <div className={`mt-5 pt-3.5 border-t border-navy-750 flex items-center justify-between text-xs font-semibold transition ${
                  feature.highlight ? "text-gold-400" : "text-slate-400 group-hover:text-gold-400"
                }`}>
                  <span>Saiba mais</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
