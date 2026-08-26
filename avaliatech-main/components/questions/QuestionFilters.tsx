"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DIFICULDADES } from "@/lib/constants";
import type { QuestaoFilters } from "@/types/question";

interface QuestionFiltersProps {
  filters: QuestaoFilters;
  onChange: (filters: QuestaoFilters) => void;
  onClear: () => void;
}

export function QuestionFilters({ filters, onChange, onClear }: QuestionFiltersProps) {
  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-brand-700" />
        <h2 className="font-black text-slate-900">Filtros</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input label="Pesquisa" value={filters.search ?? ""} onChange={(event) => onChange({ ...filters, page: 1, search: event.target.value })} placeholder="Pergunta, disciplina ou assunto" />
        <Input label="Disciplina" value={filters.disciplina ?? ""} onChange={(event) => onChange({ ...filters, page: 1, disciplina: event.target.value })} />
        <Input label="Assunto" value={filters.assunto ?? ""} onChange={(event) => onChange({ ...filters, page: 1, assunto: event.target.value })} />
        <Select
          label="Dificuldade"
          placeholder="Todas"
          value={filters.dificuldade ?? ""}
          onChange={(event) => onChange({ ...filters, page: 1, dificuldade: event.target.value })}
          options={DIFICULDADES.map((item) => ({ label: item, value: item }))}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" variant="ghost" onClick={onClear}>Limpar filtros</Button>
      </div>
    </div>
  );
}
