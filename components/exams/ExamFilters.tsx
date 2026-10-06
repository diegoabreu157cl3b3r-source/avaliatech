"use client";

import { useEffect, useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { ExamFilters as ExamFiltersType } from "@/types/exam";

interface ExamFiltersProps {
  filters: ExamFiltersType;
  onChange: (newFilters: Partial<ExamFiltersType>) => void;
  onReset: () => void;
}

export function ExamFilters({ filters, onChange, onReset }: ExamFiltersProps) {
  const [searchDraft, setSearchDraft] = useState(filters.search || "");

  useEffect(() => {
    setSearchDraft(filters.search || "");
  }, [filters.search]);

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentVal = filters.search || "";
      if (searchDraft.trim() !== currentVal.trim()) {
        onChange({ search: searchDraft.trim(), page: 1 });
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [searchDraft, filters.search, onChange]);

  const hasActiveFilters = Boolean(
    filters.search ||
      (filters.dificuldade && filters.dificuldade !== "Todas") ||
      (filters.periodo && filters.periodo !== "todos")
  );

  function handleClearSearch() {
    setSearchDraft("");
    onChange({ search: "", page: 1 });
  }

  return (
    <div className="card space-y-4 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Campo de Busca Textual com Debounce */}
        <div className="sm:col-span-2">
          <label className="label">Pesquisar provas</label>
          <div className="relative">
            <input
              type="text"
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Buscar por escola, professor, disciplina ou assunto..."
              className="field pl-10 pr-10"
            />
            <Search className="pointer-events-none absolute left-3.5 top-1/2 mt-1 h-4 w-4 -translate-y-1/2 text-slate-400" />
            {searchDraft && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3.5 top-1/2 mt-1 -translate-y-1/2 rounded-full p-1 text-slate-400 transition hover:bg-navy-850 hover:text-slate-100"
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
            { label: "Todas as provas geradas", value: "todos" },
            { label: "Últimos 7 dias", value: "7d" },
            { label: "Últimos 30 dias", value: "30d" },
            { label: "Últimos 90 dias", value: "90d" }
          ]}
        />
      </div>

      {hasActiveFilters && (
        <div className="flex items-center justify-between border-t border-navy-700 pt-3">
          <span className="flex items-center gap-1.5 text-xs font-bold text-gold-400">
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
