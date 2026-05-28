"use client"

import type { ReactNode } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import {
  ExternalLink,
  CalendarDays,
  BriefcaseBusiness,
  Wallet,
  BadgeDollarSign,
  Bookmark,
} from "lucide-react"

import type { Job } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language"
import { useSavedJobs } from "@/lib/savedJobs"

type JobDrawerProps = {
  job: Job | null
  open: boolean
  onClose: () => void
}

export function JobDrawer({
  job,
  open,
  onClose,
}: JobDrawerProps) {
  const { t, formatNumber, formatDate } = useLanguage()
  const { isSaved, saveJob, unsaveJob } = useSavedJobs()

  if (!job) {
    return null
  }

  const saved = isSaved(job.id)
  const toggleSave = () => {
    if (saved) {
      unsaveJob(job.id)
    } else {
      saveJob(job.id)
    }
  }

  function getUrgencyTone(job: Job) {
    switch (job.urgency) {
      case "today":
      case "urgent":
        return "rose"
      case "warning":
        return "amber"
      case "ok":
        return "green"
      case "expired":
        return "slate"
    }
  }

  function getUrgencyLabel(job: Job) {
    if (job.urgency === "today") {
      return t("dueToday")
    }

    if (job.urgency === "expired") {
      return t("expired")
    }

    return `${formatNumber(Math.max(job.daysLeft, 0))} ${t("daysLeft")}`
  }

  function openExternal(url: string) {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const fee = job.applicationFee?.trim()
  const freeFee = !fee || fee.toLowerCase() === "free"
  const expired = job.urgency === "expired"

  return (
    <Drawer
      open={open}
      onOpenChange={(nextOpen) =>
        !nextOpen && onClose()
      }
    >
      <DrawerContent className="h-[90vh] max-h-[90vh] overflow-hidden rounded-t-[20px] border-outline-variant/20 bg-surface text-on-surface">
        <Dialog.Title className="sr-only">
          {job.organization} - {job.postName}
        </Dialog.Title>

        <div className="flex h-full flex-col">
          {/* M3 Bottom Sheet Drag Handle */}
          <div className="flex items-center justify-center py-4">
            <span className="h-1.5 w-12 rounded-full bg-outline-variant/60 dark:bg-outline-variant/30" />
          </div>

          {/* Header Card Banner */}
          <div className="px-4 pb-4">
            <div className="overflow-hidden rounded-[16px] bg-gradient-to-br from-primary to-[#007cc2] p-5 text-white shadow-md">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="font-display text-[20px] font-black leading-tight tracking-tight text-white truncate">
                    {job.organization}
                  </h2>
                  <p className="mt-1.5 text-[13px] font-semibold text-primary-container">
                    {job.postName}
                  </p>
                </div>

                <Badge tone={getUrgencyTone(job)} className="shrink-0 bg-white/20 text-white font-bold border-none py-1.5">
                  {getUrgencyLabel(job)}
                </Badge>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[12px] font-semibold text-primary-container/90">
                <BriefcaseBusiness className="h-4 w-4" />
                {t("appSubtitle")}
              </div>
            </div>
          </div>

          {/* Details Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3.5 pb-8">
            <div className="grid gap-3">
              <Row
                icon={<BriefcaseBusiness className="h-[18px] w-[18px]" />}
                label={t("numberOfPosts")}
                value={`${formatNumber(job.numberOfPosts)} ${t("postsCount")}`}
              />

              <Row
                icon={<Wallet className="h-[18px] w-[18px]" />}
                label={t("payGrade")}
                value={job.payGrade ? formatNumber(job.payGrade) : t("notMentioned")}
              />

              <Row
                icon={<BadgeDollarSign className="h-[18px] w-[18px]" />}
                label={t("applicationFee")}
                value={
                  freeFee ? (
                    <Badge tone="green" className="py-1">
                      {t("freeApplication")}
                    </Badge>
                  ) : (
                    <Badge tone="outline" className="py-1">
                      {formatNumber(fee)}
                    </Badge>
                  )
                }
              />

              <Row
                icon={<CalendarDays className="h-[18px] w-[18px]" />}
                label={t("deadline")}
                value={
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-on-surface">
                      {formatDate(job.deadline)}
                    </span>
                    <Badge tone={getUrgencyTone(job)} className="text-[10px]">
                      {getUrgencyLabel(job)}
                    </Badge>
                  </div>
                }
              />
            </div>

            {/* M3 style Informational/Warning Card */}
            <div className="rounded-[16px] border border-outline-variant/30 bg-surface-container-low p-5 transition-colors">
              <h3 className="font-display text-[14px] font-extrabold text-on-surface flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary" />
                {t("importantNotice")}
              </h3>

              <p className="mt-2.5 text-[12px] font-semibold leading-relaxed text-on-surface-variant/80">
                {t("noticeDesc")}
              </p>
            </div>
          </div>

          {/* Action Buttons Footer */}
          <div className="border-t border-outline-variant/20 bg-surface/90 px-4 py-4 pb-[calc(16px+env(safe-area-inset-bottom))] backdrop-blur-md">
            <div className="flex flex-col gap-2.5">
              {job.circularLink ? (
                <button
                  type="button"
                  onClick={() => openExternal(job.circularLink!)}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-outline bg-transparent px-4 text-[13px] font-bold text-primary hover:bg-primary-container/10 active:scale-95 transition-all"
                >
                  <span>{t("viewCircular")}</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              ) : null}

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={toggleSave}
                  className={cn(
                    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-outline transition-all active:scale-95",
                    saved 
                      ? "bg-primary-container text-on-primary-container border-primary" 
                      : "bg-transparent text-on-surface-variant hover:bg-surface-container"
                  )}
                  aria-label={saved ? "Unsave job" : "Save job"}
                >
                  <Bookmark className="h-[18px] w-[18px]" fill={saved ? "currentColor" : "none"} />
                </button>

                <button
                  type="button"
                  onClick={() => openExternal(job.applicationLink)}
                  disabled={expired}
                  className={cn(
                    "flex h-12 flex-1 items-center justify-center gap-2 rounded-full text-[13px] font-bold text-white shadow-sm transition-all active:scale-95",
                    expired
                      ? "bg-outline-variant text-on-surface-variant/50 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/95 hover:shadow-md"
                  )}
                >
                  <span>{expired ? t("applicationClosed") : t("applyNow")}</span>
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function Row({
  label,
  value,
  icon,
}: {
  label: string
  value: ReactNode
  icon: ReactNode
}) {
  return (
    <div className="group flex items-center justify-between gap-4 rounded-[12px] border border-outline-variant/30 bg-surface-container-low p-4 shadow-sm transition-all hover:border-primary/40 dark:border-outline-variant/20">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-primary-container text-on-primary-container transition-colors">
          {icon}
        </div>
        <p className="text-[12px] font-bold text-on-surface-variant/80">
          {label}
        </p>
      </div>

      <div className="max-w-[60%] text-right text-[13px] font-extrabold text-on-surface flex items-center justify-end">
        {value}
      </div>
    </div>
  )
}