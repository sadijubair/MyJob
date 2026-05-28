"use client"

import type { Job } from "@/lib/types"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language"
import { CalendarDays } from "lucide-react"

type JobCardProps = {
  job: Job
  onTap: (job: Job) => void
}

function getUrgencyBadgeClasses(urgency: string) {
  switch (urgency) {
    case "today":
    case "urgent":
      return "bg-m3-rose-container text-m3-on-rose-container"
    case "warning":
      return "bg-m3-amber-container text-m3-on-amber-container"
    case "ok":
      return "bg-m3-emerald-container text-m3-on-emerald-container"
    case "expired":
    default:
      return "bg-m3-slate-container text-m3-on-slate-container"
  }
}

export function JobCard({ job, onTap }: JobCardProps) {
  const { t, formatNumber, formatDate } = useLanguage()

  function getUrgencyLabel(job: Job) {
    if (job.urgency === "today") {
      return t("dueToday")
    }

    if (job.urgency === "expired") {
      return t("expired")
    }

    return `${formatNumber(Math.max(job.daysLeft, 0))}${t("daysLeft")}`
  }

  const fee = job.applicationFee?.trim()
  const freeFee = !fee || fee.toLowerCase() === "free"
  const formattedFee = freeFee ? t("free") : formatNumber(fee)

  return (
    <button
      type="button"
      onClick={() => onTap(job)}
      className={cn(
        "group relative flex w-full gap-4 items-start overflow-hidden rounded-[16px] border border-outline-variant/30 bg-surface-container-low p-4 text-left shadow-[0_4px_16px_rgba(0,0,0,0.015)] hover:border-primary/30 hover:bg-surface-container transition-all active:scale-[0.98]",
        job.urgency === "expired" && "opacity-60",
      )}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 flex-1 font-display text-[15px] font-bold leading-tight text-on-surface group-hover:text-primary transition-colors truncate">
            {job.organization}
          </h3>
          <span className={cn("shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors", getUrgencyBadgeClasses(job.urgency))}>
            {getUrgencyLabel(job)}
          </span>
        </div>

        <p className="mt-1 text-[13px] font-extrabold text-on-surface-variant/80 truncate">
          {job.postName}
        </p>

        {/* Metadata Badges & Deadline */}
        <div className="mt-3.5 flex items-center justify-between gap-2.5">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-surface-container-high/60 text-on-surface-variant/90 transition-colors">
              {formatNumber(job.numberOfPosts)} {t("postsCount")}
            </span>
            <span className={cn("text-[10px] font-bold px-2.5 py-1 rounded-md transition-colors", 
              freeFee 
                ? "bg-m3-emerald-container/50 text-m3-on-emerald-container" 
                : "bg-surface-container-high/60 text-on-surface-variant/90"
            )}>
              {formattedFee}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant/65">
            <CalendarDays className="h-3.5 w-3.5 shrink-0 text-on-surface-variant/40" />
            <span>{formatDate(job.deadline)}</span>
          </div>
        </div>
      </div>
    </button>
  )
}