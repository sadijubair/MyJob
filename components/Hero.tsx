"use client"

import { useLanguage } from "@/lib/language"

type HeroProps = {
  count: number
}

export function Hero({ count }: HeroProps) {
  const { t, formatNumber } = useLanguage()

  return (
    <section className="px-5 pt-6 pb-2 transition-colors">
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-bold tracking-wider text-primary uppercase">
          {t("bangladeshJobs")}
        </span>
        <h2 className="font-display text-[30px] font-black leading-[1.1] tracking-tight text-on-surface">
          {t("findDreamJob")}
        </h2>
        <p className="text-[13px] font-semibold leading-relaxed text-on-surface-variant/80 max-w-[320px]">
          {t("heroSubtitle")}
        </p>
      </div>

      {/* Quick Stats Pill */}
      <div className="mt-4 flex items-center gap-2">
        <span className="rounded-full bg-primary-container text-on-primary-container px-3 py-1.5 text-[11px] font-bold tracking-wide">
          {t("activeJobs")}: {formatNumber(count)}
        </span>
      </div>
    </section>
  )
}