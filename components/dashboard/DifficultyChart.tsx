"use client";

import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type { DificuldadeStat } from "@/services/dashboard-service";
import { EmptyQuestionsIllustration } from "./DashboardIllustrations";

interface DifficultyChartProps {
  data: DificuldadeStat[];
  totalQuestoes: number;
}

const difficultyColors = {
  Fácil: {
    stroke: "#10B981", // emerald-500
    dot: "bg-emerald-500",
    label: "Fácil"
  },
  Média: {
    stroke: "#F59E0B", // amber-500
    dot: "bg-amber-500",
    label: "Médio"
  },
  Difícil: {
    stroke: "#EF4444", // rose-500
    dot: "bg-rose-500",
    label: "Difícil"
  }
};

export function DifficultyChart({ data, totalQuestoes }: DifficultyChartProps) {
  if (totalQuestoes === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <EmptyQuestionsIllustration className="h-16 w-16 mb-2" />
        <p className="text-xs font-semibold text-slate-200">Ainda não há questões</p>
        <p className="mt-0.5 text-[11px] text-slate-400 max-w-[200px]">
          Cadastre questões para ver a distribuição de dificuldade.
        </p>
        <Link
          href="/questoes"
          className="mt-2.5 inline-flex items-center gap-1.5 rounded-lg border border-navy-700 bg-navy-850 px-3 py-1 text-xs font-semibold text-gold-400 transition hover:bg-navy-800"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Adicionar questão
        </Link>
      </div>
    );
  }

  // Radius and Circumference for Donut
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let accumulatedPercent = 0;

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Donut Chart SVG */}
      <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          {/* Background circle track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="11"
            className="text-navy-850"
          />

          {/* Segments */}
          {data.map((item) => {
            if (item.total === 0) return null;
            const config = difficultyColors[item.dificuldade] || difficultyColors.Fácil;
            const dashLength = (item.porcentagem / 100) * circumference;
            const strokeDashoffset = -((accumulatedPercent / 100) * circumference);
            accumulatedPercent += item.porcentagem;

            return (
              <circle
                key={item.dificuldade}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={config.stroke}
                strokeWidth="11"
                strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-700 ease-out"
              />
            );
          })}
        </svg>

        {/* Center Text */}
        <div className="absolute flex flex-col items-center justify-center text-center select-none pointer-events-none">
          <span className="text-xl font-extrabold text-slate-100 leading-none">
            {totalQuestoes}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 mt-1 leading-none">
            {totalQuestoes === 1 ? "questão" : "questões"}
          </span>
        </div>
      </div>

      {/* Legend & Stats */}
      <div className="w-full flex-1 space-y-2.5">
        {data.map((item) => {
          const config = difficultyColors[item.dificuldade] || difficultyColors.Fácil;
          return (
            <div key={item.dificuldade} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`h-2.5 w-2.5 rounded-full ${config.dot} shrink-0`} />
                <span className="font-medium text-slate-300 truncate">{config.label}</span>
              </div>
              <div className="flex items-center gap-2 font-semibold tabular-nums">
                <span className="text-slate-100 min-w-[32px] text-right">{item.porcentagem}%</span>
                <span className="text-slate-400 text-[11px] min-w-[28px] text-right">({item.total})</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
