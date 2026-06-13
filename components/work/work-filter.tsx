"use client";

import type { WorkFilterCategory } from "@/content/case-studies";
import { getCategoryCounts } from "@/content/case-studies";

type WorkFilterProps = {
  activeCategory: WorkFilterCategory;
  onChange: (category: WorkFilterCategory) => void;
};

const filters: { id: WorkFilterCategory; label: string }[] = [
  { id: "all", label: "ALL" },
  { id: "product-design", label: "PRODUCT DESIGN" },
  { id: "strategy-research", label: "STRATEGY & RESEARCH" },
];

export function WorkFilter({ activeCategory, onChange }: WorkFilterProps) {
  const counts = getCategoryCounts();

  return (
    <aside className="work-filter">
      <p className="work-filter__label">Filter</p>
      <ul className="work-filter__list">
        {filters.map((filter) => (
          <li key={filter.id}>
            <button
              type="button"
              className={`work-filter__button${
                activeCategory === filter.id ? " work-filter__button--active" : ""
              }`}
              onClick={() => onChange(filter.id)}
            >
              {filter.label} ({counts[filter.id]})
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
