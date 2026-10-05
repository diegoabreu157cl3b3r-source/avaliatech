"use client";

import Link from "next/link";
import {
  PlusCircle,
  Calculator,
  BookOpen,
  Landmark,
  Globe2,
  Dna,
  FlaskConical,
  Zap,
  Languages,
  GraduationCap,
  Palette,
  BookMarked,
  type LucideIcon
} from "lucide-react";
import type { DisciplinaStat } from "@/services/dashboard-service";
import { EmptyDisciplinesIllustration } from "./DashboardIllustrations";

interface DisciplineChartProps {
  data: DisciplinaStat[];
  totalQuestoes: number;
}

function getDisciplineIcon(name: string): LucideIcon {
  const normalized = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  if (normalized.includes("matemat") || normalized.includes("geometr") || normalized.includes("calculo") || normalized.includes("algeb")) {
    return Calculator;
  }
  if (normalized.includes("portug") || normalized.includes("literat") || normalized.includes("redac") || normalized.includes("gramat")) {
    return BookOpen;
  }
  if (normalized.includes("histor")) {
    return Landmark;
  }
  if (normalized.includes("geograf")) {
    return Globe2;
  }
  if (normalized.includes("biolog") || normalized.includes("cienc") || normalized.includes("ecolog")) {
    return Dna;
  }
  if (normalized.includes("quimic")) {
    return FlaskConical;
  }
  if (normalized.includes("fisic") || normalized.includes("eletric")) {
    return Zap;
  }
  if (normalized.includes("ingl") || normalized.includes("espanh") || normalized.includes("lingua") || normalized.includes("idiom")) {
    return Languages;
  }
  if (normalized.includes("filosof") || normalized.includes("sociolog")) {
    return GraduationCap;
  }
  if (normalized.includes("arte") || normalized.includes("music") || normalized.includes("desenh")) {
    return Palette;
  }

  return BookMarked;
}

export function DisciplineChart({ data, totalQuestoes }: DisciplineChartProps) {
  if (data.length === 0 || totalQuestoes === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-2 text-center">
        <EmptyDisciplinesIllustration className="h-16 w-16 mb-2" />
        <p className="text-xs font-semibold text-slate-200">Nenhuma disciplina cadastrada</p>
        <p className="mt-0.5 text-[11px] text-slate-400 max-w-[200px]">
          Adicione questões para mapear suas matérias.
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

  const maxTotal = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="space-y-3">
      {data.slice(0, 5).map((item) => {
        const relativeWidth = Math.max(Math.round((item.total / maxTotal) * 100), 10);
        const Icon = getDisciplineIcon(item.disciplina);

        return (
          <div key={item.disciplina} className="flex items-center gap-2.5 text-xs group">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-navy-850 border border-navy-750/70 text-gold-400 group-hover:border-gold-500/40 group-hover:bg-navy-800 transition">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="w-24 shrink-0 truncate font-medium text-slate-300 group-hover:text-slate-100 transition" title={item.disciplina}>
              {item.disciplina}
            </span>
            <div className="flex-1 h-2 overflow-hidden rounded-full bg-navy-850 border border-navy-750/60">
              <div
                style={{ width: `${relativeWidth}%` }}
                className="h-full rounded-full bg-gold-500 transition-all duration-500 group-hover:brightness-110"
              />
            </div>
            <span className="w-7 shrink-0 text-right font-bold text-slate-100 tabular-nums">
              {item.total}
            </span>
          </div>
        );
      })}
    </div>
  );
}
