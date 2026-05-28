"use client"

import { SearchX } from "lucide-react"
import { useLanguage } from "@/lib/language"

type EmptyStateProps = {
  onChange: (filter: "all") => void
}

export function EmptyState({ onChange }: EmptyStateProps) {
  const { t } = useLanguage()

  return (
    <div className="flex min-h-[44vh] flex-col items-center justify-center px-4 text-center">
      <SearchX className="h-12 w-12 text-on-surface-variant/40" />
      <h2 className="mt-4 text-[16px] font-bold text-on-surface">
        {t("noPositions")}
      </h2>
      <p className="mt-2 text-[13px] font-semibold leading-relaxed text-on-surface-variant/70">
        {t("tryDifferentFilter")}
      </p>
      <button
        type="button"
        onClick={() => onChange("all")}
        className="mt-4 text-[13px] font-extrabold text-primary hover:text-primary/80 transition-colors"
      >
        {t("showAllJobs")}
      </button>
    </div>
  )
}