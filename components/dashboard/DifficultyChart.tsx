"use client";

import type { DificuldadeStat } from "@/services/dashboard-service";

interface DifficultyChartProps {
  data: DificuldadeStat[];
  totalQuestoes: number;
}

const difficultyConfig = {
  Fácil: {
    color: "bg-emerald-500",
    textColor: "text-emerald-700 dark:text-emerald-300",
    badgeBg: "bg-emerald-50/80 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800/80"
  },
  Média: {
    color: "bg-amber-500",
    textColor: "text-amber-700 dark:text-amber-300",
    badgeBg: "bg-amber-50/80 border-amber-200 dark:bg-amber-950/40 dark:border-amber-800/80"
  },
  Difícil: {
    color: "bg-rose-500",
    textColor: "text-rose-700 dark:text-rose-300",
    badgeBg: "bg-rose-50/80 border-rose-200 dark:bg-rose-950/40 dark:border-rose-800/80"
  }
};

export function DifficultyChart({ data, totalQuestoes }: DifficultyChartProps) {
  if (totalQuestoes === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Nenhuma questão cadastrada para calcular o gráfico.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Barra de progresso segmentada */}
      <div className="flex h-4 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        {data.map((item) => {
          if (item.total === 0) return null;
          const config = difficultyConfig[item.dificuldade];
          return (
            <div
              key={item.dificuldade}
              style={{ width: `${item.porcentagem}%` }}
              className={`h-full transition-all duration-500 ${config.color}`}
              title={`${item.dificuldade}: ${item.total} (${item.porcentagem}%)`}
            />
          );
        })}
      </div>

      {/* Cards com detalhes por dificuldade */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {data.map((item) => {
          const config = difficultyConfig[item.dificuldade];
          return (
            <div
              key={item.dificuldade}
              className={`rounded-2xl border p-3.5 transition ${config.badgeBg}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  <span className={`h-2.5 w-2.5 rounded-full ${config.color}`} />
                  {item.dificuldade}
                </span>
                <span className={`text-xs font-black ${config.textColor}`}>
                  {item.porcentagem}%
                </span>
              </div>
              <strong className="mt-2 block text-2xl font-black text-slate-900 dark:text-slate-100">
                {item.total}
              </strong>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {item.total === 1 ? "questão" : "questões"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
