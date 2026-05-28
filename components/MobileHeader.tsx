"use client"

import { Bell, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/lib/language"
import type { Job } from "@/lib/types"

type MobileHeaderProps = {
  jobs?: Job[]
}

export function MobileHeader({ jobs = [] }: MobileHeaderProps) {
  const router = useRouter()
  const [dark, setDark] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { language, setLanguage, t, formatNumber } = useLanguage()

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      document.documentElement.classList.add("dark")
      setDark(true)
    }
  }, [])

  const toggleTheme = () => {
    const html = document.documentElement
    if (html.classList.contains("dark")) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setDark(false)
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setDark(true)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "bn" : "en")
  }

  // Filter jobs for notifications
  const todayJobs = jobs.filter((job) => job.daysLeft === 0)
  const threeDaysJobs = jobs.filter((job) => job.daysLeft > 0 && job.daysLeft <= 3)
  const hasNotifications = todayJobs.length > 0 || threeDaysJobs.length > 0

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/20 bg-surface/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-[72px] w-full max-w-[480px] items-center justify-between px-4">
        <div>
          <h1 className="font-display text-[22px] font-extrabold tracking-tight text-on-surface">
            {t("appName").slice(0, 2)}
            <span className="text-primary">{t("appName").slice(2)}</span>
          </h1>
          <p className="text-[10px] font-medium tracking-wide text-on-surface-variant/70 uppercase">
            {t("appSubtitle")}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Language Toggle Button */}
          <button
            onClick={toggleLanguage}
            className="flex h-10 px-2.5 items-center justify-center gap-1.5 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant transition active:scale-95"
            aria-label="Toggle language"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="1.6 1.6 20.8 20.8"
              className="h-[18px] w-[18px] shrink-0"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".75"
                d="M16.92 22a5.08 5.08 0 1 1 0-10.16 5.08 5.08 0 0 1 0 10.16ZM5.02 2h3.92c2.07 0 3.07 1 3.02 3.02v3.92c.05 2.07-.95 3.07-3.02 3.02H5.02C3 12 2 11 2 8.93V5.01C2 3 3 2 5.02 2ZM2 15a7 7 0 0 0 7 7l-1.05-1.75M22 9a7 7 0 0 0-7-7l1.05 1.75"
              />
              <text
                x="7"
                y="9.5"
                fill="currentColor"
                fontFamily="serif"
                fontSize="8"
                textAnchor="middle"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".15"
              >
                অ
              </text>
              <text
                x="17"
                y="19.5"
                fill="currentColor"
                fontFamily="sans-serif"
                fontSize="8"
                textAnchor="middle"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth=".15"
              >
                A
              </text>
            </svg>
            <span className="text-[12px] font-bold tracking-wider">
              {language === "en" ? "বাং" : "EN"}
            </span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition active:scale-95"
            aria-label="Toggle theme"
          >
            {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {/* Notifications Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-on-primary shadow-sm hover:shadow-md transition active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
            {hasNotifications && (
              <span className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full bg-m3-rose ring-2 ring-primary animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* Notifications Popover Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          {/* Popover Panel */}
          <div className="absolute right-4 top-[78px] z-50 w-[310px] rounded-[16px] border border-outline-variant/30 bg-surface-container p-4 shadow-lg animate-tab-transition">
            <div className="flex items-center justify-between border-b border-outline-variant/20 pb-2.5 mb-3">
              <h4 className="font-display text-[14px] font-black text-on-surface">
                {t("notificationsTitle")}
              </h4>
              {hasNotifications && (
                <span className="flex h-5 items-center justify-center rounded-full bg-primary-container px-2 text-[10px] font-bold text-on-primary-container">
                  {formatNumber(todayJobs.length + threeDaysJobs.length)}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {/* Today Expiring Notification */}
              {todayJobs.length > 0 ? (
                <button
                  onClick={() => {
                    router.push("/?tab=home&filter=today")
                    setIsOpen(false)
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-[12px] bg-m3-rose-container/10 border border-m3-rose-container/20 hover:bg-m3-rose-container/20 text-left transition active:scale-[0.98]"
                >
                  <div className="h-8 w-8 rounded-full bg-m3-rose-container flex items-center justify-center text-m3-on-rose-container shrink-0 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-m3-rose animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <h5 className="text-[12px] font-bold text-on-surface">
                      {t("jobsTodayTitle")}
                    </h5>
                    <p className="text-[11px] font-semibold text-on-surface-variant/80 mt-0.5 leading-normal">
                      {t("jobsTodayDesc").replace("{count}", formatNumber(todayJobs.length))}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-start gap-3 p-3 rounded-[12px] bg-surface-container-low/50 border border-outline-variant/10 text-left opacity-60">
                  <div className="h-8 w-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <h5 className="text-[12px] font-bold text-on-surface-variant">
                      {t("jobsTodayTitle")}
                    </h5>
                    <p className="text-[11px] font-semibold text-on-surface-variant/70 mt-0.5 leading-normal">
                      {t("jobsTodayEmpty")}
                    </p>
                  </div>
                </div>
              )}

              {/* 3 Days Expiring Notification */}
              {threeDaysJobs.length > 0 ? (
                <button
                  onClick={() => {
                    router.push("/?tab=home&filter=3days")
                    setIsOpen(false)
                  }}
                  className="w-full flex items-start gap-3 p-3 rounded-[12px] bg-m3-amber-container/10 border border-m3-amber-container/20 hover:bg-m3-amber-container/20 text-left transition active:scale-[0.98]"
                >
                  <div className="h-8 w-8 rounded-full bg-m3-amber-container flex items-center justify-center text-m3-on-amber-container shrink-0 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-m3-amber" />
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <h5 className="text-[12px] font-bold text-on-surface">
                      {t("jobs3DaysTitle")}
                    </h5>
                    <p className="text-[11px] font-semibold text-on-surface-variant/80 mt-0.5 leading-normal">
                      {t("jobs3DaysDesc").replace("{count}", formatNumber(threeDaysJobs.length))}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="flex items-start gap-3 p-3 rounded-[12px] bg-surface-container-low/50 border border-outline-variant/10 text-left opacity-60">
                  <div className="h-8 w-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shrink-0 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-outline-variant" />
                  </div>
                  <div className="flex-1 min-w-0 font-sans">
                    <h5 className="text-[12px] font-bold text-on-surface-variant">
                      {t("jobs3DaysTitle")}
                    </h5>
                    <p className="text-[11px] font-semibold text-on-surface-variant/70 mt-0.5 leading-normal">
                      {t("jobs3DaysEmpty")}
                    </p>
                  </div>
                </div>
              )}

              {/* Empty State when both are zero */}
              {!hasNotifications && (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="h-10 w-10 rounded-full bg-m3-emerald-container flex items-center justify-center text-m3-on-emerald-container mb-2.5">
                    <span className="text-[16px] font-bold">✓</span>
                  </div>
                  <h5 className="text-[13px] font-bold text-on-surface">
                    {t("allCaughtUp")}
                  </h5>
                  <p className="text-[11px] font-semibold text-on-surface-variant/70 mt-1 max-w-[200px] leading-normal font-sans">
                    {t("allCaughtUpDesc")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </header>
  )
}