"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";

export interface ComboboxOption {
  label: string;
  value: string;
  count?: number;
}

interface ComboboxProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: (ComboboxOption | string)[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  required?: boolean;
  allowClear?: boolean;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
  error?: string;
  className?: string;
}

export function Combobox({
  label,
  value,
  onChange,
  options,
  placeholder = "Selecione uma opção...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhuma opção encontrada.",
  disabled = false,
  required = false,
  allowClear = false,
  actionButton,
  error,
  className = ""
}: ComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Normalize options to ComboboxOption objects
  const normalizedOptions: ComboboxOption[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  // Filter options
  const filteredOptions = normalizedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  function handleSelect(val: string) {
    onChange(val);
    setIsOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onChange("");
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {label && (
        <label className="mb-1.5 block text-xs font-semibold text-slate-300 dark:text-slate-300">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}

      {/* Main trigger button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition ${
          disabled
            ? "cursor-not-allowed border-navy-800 bg-navy-950/40 text-slate-500 opacity-60"
            : isOpen
            ? "border-gold-500 bg-navy-900 text-slate-100 ring-1 ring-gold-500/20"
            : "border-navy-750 bg-navy-900/90 text-slate-200 hover:border-navy-650 hover:bg-navy-850"
        } ${error ? "border-rose-500 ring-1 ring-rose-500/20" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`block truncate ${!selectedOption && !value ? "text-slate-400" : "font-medium text-slate-100"}`}>
          {selectedOption ? selectedOption.label : value || placeholder}
        </span>

        <div className="flex items-center gap-1 shrink-0">
          {allowClear && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={handleClear}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onChange("");
                }
              }}
              className="rounded p-0.5 text-slate-400 hover:text-slate-200 transition"
              aria-label="Limpar seleção"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
          <ChevronDown
            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-gold-400" : ""
            }`}
          />
        </div>
      </button>

      {error && <p className="mt-1 text-xs font-semibold text-rose-400">{error}</p>}

      {/* Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 right-0 z-50 mt-1.5 max-h-72 overflow-hidden rounded-2xl border border-navy-700 bg-navy-900 shadow-2xl animate-in fade-in-50 zoom-in-95">
          {/* Search bar if multiple options or search enabled */}
          {normalizedOptions.length > 4 && (
            <div className="border-b border-navy-800 p-2">
              <div className="relative flex items-center">
                <Search className="absolute left-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full rounded-lg border border-navy-750 bg-navy-950/80 py-1.5 pl-8 pr-3 text-xs text-slate-100 placeholder-slate-400 outline-none focus:border-gold-500/50"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Option list */}
          <div className="max-h-52 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-slate-400">
                {emptyMessage}
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs sm:text-sm transition ${
                      isSelected
                        ? "bg-gold-500/10 text-gold-400 font-semibold border border-gold-500/20"
                        : "text-slate-300 hover:bg-navy-800 hover:text-slate-100"
                    }`}
                  >
                    <span className="truncate">{option.label}</span>
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {typeof option.count === "number" && (
                        <span className="rounded-md bg-navy-800 px-1.5 py-0.5 text-[10px] text-slate-400 border border-navy-700">
                          {option.count}
                        </span>
                      )}
                      {isSelected && <Check className="h-3.5 w-3.5 text-gold-400" />}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Action button at bottom */}
          {actionButton && (
            <div className="border-t border-navy-800 p-1.5 bg-navy-950/40">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  actionButton.onClick();
                }}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-semibold text-gold-400 hover:bg-gold-500/10 transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{actionButton.label}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

