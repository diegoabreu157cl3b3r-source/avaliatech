"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

interface SuggestionInputProps {
  label: string;
  type: "discipline" | "subject";
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  discipline?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function SuggestionInput({ label, type, value, onChange, onSelect, discipline, placeholder, disabled }: SuggestionInputProps) {
  const [items, setItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeWhenClickingOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", closeWhenClickingOutside);
    return () => document.removeEventListener("mousedown", closeWhenClickingOutside);
  }, []);

  useEffect(() => {
    if (disabled || (type === "subject" && !discipline)) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams({ type, query: value });
        if (type === "subject" && discipline) params.set("discipline", discipline);
        const response = await fetch(`/api/questions/suggestions?${params}`, { signal: controller.signal });
        const json = await response.json();
        if (response.ok) setItems(json.data?.items ?? []);
        else setItems([]);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setItems([]);
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [discipline, disabled, type, value]);

  function select(valueToSelect: string) {
    onSelect(valueToSelect);
    setIsOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || items.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((current) => Math.min(current + 1, items.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((current) => Math.max(current - 1, 0));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      select(items[activeIndex]);
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  const showResults = isOpen && !disabled && (isLoading || items.length > 0 || value.length > 0);

  return (
    <div ref={rootRef} className="relative">
      <label className="block">
        <span className="label">{label}</span>
        <input
          className="field"
          value={value}
          onChange={(event) => { onChange(event.target.value); setIsOpen(true); setActiveIndex(-1); }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={showResults}
          aria-autocomplete="list"
        />
      </label>
      {showResults && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-2xl border border-navy-700 bg-navy-900 py-1 shadow-2xl" role="listbox">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-slate-400">Buscando sugestões...</p>
          ) : items.length > 0 ? (
            items.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`block w-full px-3 py-2 text-left text-sm transition ${
                  activeIndex === index
                    ? "bg-navy-800 text-gold-400 font-bold"
                    : "text-slate-300 hover:bg-navy-850 hover:text-slate-100"
                }`}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => select(item)}
                role="option"
                aria-selected={activeIndex === index}
              >
                {item}
              </button>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-slate-400">Nenhuma sugestão encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
