"use client";

import { useState } from "react";

interface FilterChip {
  id: string;
  icon: string;
  label: string;
}

const FILTERS: FilterChip[] = [
  { id: "cargo", icon: "work", label: "Cargo" },
  { id: "ciudad", icon: "location_on", label: "Ciudad" },
  { id: "salario", icon: "payments", label: "Salario" },
  { id: "contrato", icon: "history_edu", label: "Contrato" },
];

export default function VacantesFilters() {
  const [search, setSearch] = useState("");
  // Múltiples filtros pueden estar activos simultáneamente
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(["cargo"])
  );

  const toggleFilter = (id: string) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section className="mb-lg">
      {/* Buscador */}
      <div className="relative mb-md">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline pointer-events-none">
          search
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cargo o empresa..."
          className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary-container text-body-md transition-all outline-none"
        />
      </div>

      {/* Filter chips — scroll horizontal sin scrollbar */}
      <div className="flex overflow-x-auto gap-sm hide-scrollbar pb-xs">
        {FILTERS.map(({ id, icon, label }) => {
          const isActive = activeFilters.has(id);
          return (
            <button
              key={id}
              onClick={() => toggleFilter(id)}
              className={`flex items-center gap-xs px-md py-2 rounded-full text-label-md whitespace-nowrap active:scale-95 transition-all ${
                isActive
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">
                {icon}
              </span>
              {label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
