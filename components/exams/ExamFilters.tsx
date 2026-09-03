"use client";

import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ExamFilters as ExamFiltersType } from "@/types/exam";

interface ExamFiltersProps {
  filters: ExamFiltersType;
  onChange: (newFilters: Partial<ExamFiltersType>) => void;
  onReset: () => void;
}

export function ExamFilters({ filters, onChange, onReset }: ExamFiltersProps) {
  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.dificuldade && filters.dificuldade !== "Todas") ||
      (filters.periodo && filters.periodo !== "todos")
  );

  return (
    <div className="card space-y-4 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Campo de Busca Textual */}
        <div className="sm:col-span-2">
          <label className="label">Pesquisar provas</label>
          <div className="relative">
            <input
              type="text"
              value={filters.search || ""}
              onChange={(e) => onChange({ search: e.target.value, page: 1 })}
              placeholder="Buscar por escola, professor, disciplina ou assunto..."
              className="field pl-10 pr-10"
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-400" />
            {filters.search && (
              <button
                type="button"
                onClick={() => onChange({ search: "", page: 1 })}
                className="absolute right-3.5 top-1/2 mt-1 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filtro de Dificuldade */}
        <Select
          label="Dificuldade"
          value={filters.dificuldade || "Todas"}
          onChange={(e) => onChange({ dificuldade: e.target.value, page: 1 })}
          options={[
            { label: "Todas as dificuldades", value: "Todas" },
            { label: "Fácil", value: "Fácil" },
            { label: "Média", value: "Média" },
            { label: "Difícil", value: "Difícil" },
            { label: "Balanceada", value: "Balanceada" },
            { label: "Personalizada", value: "Personalizada" }
          ]}
        />

        {/* Filtro de Período */}
        <Select
          label="Período"
          value={filters.periodo || "todos"}
          onChange={(e) => onChange({ periodo: e.target.value as "todos" | "7d" | "30d" | "90d", page: 1 })}
          options={[
            { label: "Todo o histórico", value: "todos" },
            { label: "Últimos 7 dias", value: "7d" },
            { label: "Últimos 30 dias", value: "30d" },
            { label: "Últimos 90 dias", value: "90d" }
          ]}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400">
            <Filter className="h-3.5 w-3.5" /> Filtros ativos
          </span>
          <Button
            type="button"
            variant="ghost"
            className="h-8 px-2 text-xs"
            onClick={onReset}
          >
            Limpar filtros
          </Button>
        </div>
      )}
    </div>
  );
}
