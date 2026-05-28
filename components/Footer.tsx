"use client"

import { useLanguage } from "@/lib/language"

export function Footer() {
  const { t, formatNumber } = useLanguage()

  return (
    <div className="flex flex-col items-center pt-8 pb-12 px-1 transition-colors">
      {/* M3 Circular App Icon Logo */}
      <div className="h-16 w-16 rounded-[12px] bg-primary flex items-center justify-center font-display font-black text-[24px] text-white shadow-md shadow-primary/10">
        MJ
      </div>

      <h2 className="mt-4 font-display text-[22px] font-black text-on-surface">
        {t("appName")}
      </h2>
      <p className="mt-1 text-[10px] font-bold tracking-wider text-primary uppercase">
        {t("appSubtitle")}
      </p>

      <p className="mt-4 text-[13px] font-semibold text-on-surface-variant/80 text-center leading-relaxed max-w-[320px]">
        {t("footerDesc")}
      </p>

      {/* M3 Preference List / Info Group */}
      <div className="w-full mt-8 space-y-2.5">
        <InfoRow label={t("updatedDaily")} value={formatNumber("24/7")} />
        <InfoRow label="Version" value="0.0.1" />
        <InfoRow label="Platform" value="Android Web App" />
        <InfoRow label="Source" value="Public Circulars" />
      </div>

      {/* Notice Card */}
      <div className="mt-6 rounded-[12px] border border-outline-variant/30 bg-surface-container-low p-4 w-full">
        <p className="text-[11px] font-bold text-on-surface-variant/80 leading-relaxed text-center">
          {t("disclaimer")}
        </p>
      </div>

      {/* Credits */}
      <p className="mt-10 text-[10px] font-bold text-on-surface-variant/40">
        {t("developedWith")}
      </p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-[12px] bg-surface-container-low border border-outline-variant/15 transition-colors">
      <span className="text-[12px] font-bold text-on-surface-variant/90">{label}</span>
      <span className="text-[12px] font-extrabold text-on-surface">{value}</span>
    </div>
  )
}