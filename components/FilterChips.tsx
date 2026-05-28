"use client"

import type { FilterType } from "@/lib/types"
import { useLanguage } from "@/lib/language"

type FilterChipsProps = {
  activeFilter: FilterType
  onChange: (filter: FilterType) => void
}

export function FilterChips({ activeFilter, onChange }: FilterChipsProps) {
  const { t } = useLanguage()

  const filters: Array<{
    filter: FilterType
    labelKey: string
    activeClass: string
  }> = [
    { filter: "all", labelKey: "filterAll", activeClass: "bg-primary text-on-primary shadow-sm" },
    { filter: "today", labelKey: "filterToday", activeClass: "bg-m3-rose-container text-m3-on-rose-container" },
    { filter: "3days", labelKey: "filter3days", activeClass: "bg-m3-amber-container text-m3-on-amber-container" },
    { filter: "7days", labelKey: "filter7days", activeClass: "bg-m3-emerald-container text-m3-on-emerald-container" },
    { filter: "expired", labelKey: "filterExpired", activeClass: "bg-m3-slate-container text-m3-on-slate-container" },
  ]

  return (
    <div className="sticky top-14 z-40 border-b border-outline-variant/10 bg-surface px-4 py-3 transition-colors">
      <div className="no-scrollbar mx-auto flex w-full max-w-[480px] gap-2.5 overflow-x-auto whitespace-nowrap scroll-smooth">
        {filters.map((chip) => {
          const active = chip.filter === activeFilter

          return (
            <button
              key={chip.filter}
              type="button"
              onClick={() => onChange(chip.filter)}
              className={
                active
                  ? `h-[36px] rounded-full px-4 text-[13px] font-bold tracking-wide transition-all duration-200 scale-102 ${chip.activeClass}`
                  : "h-[36px] rounded-full border border-outline-variant/60 bg-surface-container-low/70 px-4 text-[13px] font-semibold text-on-surface-variant/80 transition-all duration-200 hover:border-outline hover:bg-surface-container-high/60 active:scale-95"
              }
            >
              {t(chip.labelKey)}
            </button>
          )
        })}
      </div>
    </div>
  )
}