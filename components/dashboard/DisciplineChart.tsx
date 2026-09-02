"use client";

import type { DisciplinaStat } from "@/services/dashboard-service";

interface DisciplineChartProps {
  data: DisciplinaStat[];
  totalQuestoes: number;
}

const colors = [
  "bg-brand-600 dark:bg-brand-500",
  "bg-indigo-600 dark:bg-indigo-500",
  "bg-cyan-600 dark:bg-cyan-500",
  "bg-violet-600 dark:bg-violet-500",
  "bg-emerald-600 dark:bg-emerald-500",
  "bg-amber-600 dark:bg-amber-500",
  "bg-rose-600 dark:bg-rose-500",
  "bg-teal-600 dark:bg-teal-500"
];

export function DisciplineChart({ data, totalQuestoes }: DisciplineChartProps) {
  if (data.length === 0 || totalQuestoes === 0) {
    return (
      <div className="flex h-36 flex-col items-center justify-center text-center">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          Nenhuma disciplina cadastrada ainda.
        </p>
      </div>
    );
  }

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="space-y-3.5">
      {data.map((item, index) => {
        const colorClass = colors[index % colors.length];
        const relativeWidth = Math.max(Math.round((item.total / maxTotal) * 100), 8);

        return (
          <div key={item.disciplina} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {item.disciplina}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-500 dark:text-slate-400">
                  {item.total} {item.total === 1 ? "questão" : "questões"}
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">
                  {item.porcentagem}%
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                style={{ width: `${relativeWidth}%` }}
                className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
