"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Combobox } from "@/components/ui/Combobox";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { DIFICULDADES } from "@/lib/constants";
import { getDisciplines } from "@/services/discipline-service";
import type { DisciplinaWithAssuntos } from "@/types/discipline";
import type { QuestaoFilters } from "@/types/question";

interface QuestionFiltersProps {
  filters: QuestaoFilters;
  onChange: (filters: QuestaoFilters) => void;
  onClear: () => void;
}

export function QuestionFilters({ filters, onChange, onClear }: QuestionFiltersProps) {
  const [disciplines, setDisciplines] = useState<DisciplinaWithAssuntos[]>([]);
  const [searchDraft, setSearchDraft] = useState(filters.search ?? "");

  useEffect(() => {
    async function loadDisciplines() {
      try {
        const res = await getDisciplines();
        if (res.data) setDisciplines(res.data);
      } catch (err) {
        console.error("Erro ao carregar filtros de disciplinas:", err);
      }
    }
    loadDisciplines();
  }, []);

  // Sync internal draft when external filter prop changes (e.g. on clear)
  useEffect(() => {
    setSearchDraft(filters.search ?? "");
  }, [filters.search]);

  // Debounce search input by 450ms
  useEffect(() => {
    const handler = setTimeout(() => {
      const currentVal = filters.search ?? "";
      if (searchDraft.trim() !== currentVal.trim()) {
        onChange({ ...filters, page: 1, search: searchDraft.trim() });
      }
    }, 450);

    return () => clearTimeout(handler);
  }, [searchDraft, filters, onChange]);

  const selectedDiscipline = disciplines.find(
    (d) => d.nome.toLowerCase() === (filters.disciplina || "").toLowerCase()
  );
  const availableSubjects = selectedDiscipline
    ? selectedDiscipline.assuntos
    : disciplines.flatMap((d) => d.assuntos);

  // Remove duplicates from subjects if no discipline selected
  const uniqueSubjectOptions = Array.from(
    new Set(availableSubjects.map((s) => s.nome))
  ).map((nome) => ({ label: nome, value: nome }));

  function handleDisciplineChange(val: string) {
    onChange({
      ...filters,
      page: 1,
      disciplina: val,
      assunto: filters.disciplina === val ? filters.assunto : ""
    });
  }

  function handleSubjectChange(val: string) {
    onChange({
      ...filters,
      page: 1,
      assunto: val
    });
  }

  function handleClear() {
    setSearchDraft("");
    onClear();
  }

  return (
    <div className="card">
      <div className="mb-4 flex items-center gap-2">
        <Search className="h-5 w-5 text-gold-400" />
        <h2 className="font-bold text-slate-100">Filtros de busca</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Input
          label="Pesquisa de texto"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Digite para buscar..."
        />

        <Combobox
          label="Disciplina"
          value={filters.disciplina ?? ""}
          onChange={handleDisciplineChange}
          options={disciplines.map((d) => ({
            label: d.nome,
            value: d.nome,
            count: d.total_questoes
          }))}
          placeholder="Todas as disciplinas"
          searchPlaceholder="Buscar disciplina..."
          emptyMessage="Nenhuma disciplina cadastrada."
          allowClear
        />

        <Combobox
          label="Assunto"
          value={filters.assunto ?? ""}
          onChange={handleSubjectChange}
          options={uniqueSubjectOptions}
          placeholder={
            filters.disciplina && uniqueSubjectOptions.length === 0
              ? "Nenhum assunto cadastrado"
              : "Todos os assuntos"
          }
          searchPlaceholder="Buscar assunto..."
          emptyMessage="Nenhum assunto encontrado."
          disabled={Boolean(filters.disciplina && uniqueSubjectOptions.length === 0)}
          allowClear
        />

        <Select
          label="Dificuldade"
          placeholder="Todas as dificuldades"
          value={filters.dificuldade ?? ""}
          onChange={(event) => onChange({ ...filters, page: 1, dificuldade: event.target.value })}
          options={DIFICULDADES.map((item) => ({ label: item, value: item }))}
        />
      </div>
      <div className="mt-4 flex justify-end">
        <Button type="button" variant="ghost" onClick={handleClear}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}
