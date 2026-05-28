// components/JobGrid.tsx

"use client"

import { useMemo, useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSavedJobs } from "@/lib/savedJobs"
import { Search, X, ArrowLeft, Bookmark } from "lucide-react"

import { EmptyState } from "@/components/EmptyState"
import { FilterChips } from "@/components/FilterChips"
import { JobCard } from "@/components/JobCard"
import { JobDrawer } from "@/components/JobDrawer"
import { Hero } from "@/components/Hero"
import { Footer } from "@/components/Footer"
import { About } from "@/components/About"
import { filterJobs } from "@/lib/filterJobs"
import type { FilterType, Job } from "@/lib/types"
import { useLanguage } from "@/lib/language"

type JobGridProps = {
  jobs: Job[]
}

export function JobGrid({ jobs }: JobGridProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const tab = searchParams.get("tab") || "home"

  const { t, formatNumber } = useLanguage()
  const { savedIds } = useSavedJobs()

  const activeFilter = (searchParams.get("filter") as FilterType) || "all"
  const [activeJob, setActiveJob] = useState<Job | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const handleFilterChange = (newFilter: FilterType) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newFilter === "all") {
      params.delete("filter")
    } else {
      params.set("filter", newFilter)
    }
    router.push(`/?${params.toString()}`)
  }

  // Reset queries when switching tabs
  useEffect(() => {
    setSearchQuery("")
  }, [tab])

  // Count active jobs
  const activeCount = useMemo(
    () => jobs.filter((job) => job.daysLeft >= 0).length,
    [jobs]
  )

  // Filter jobs for Home tab
  const filteredJobs = useMemo(
    () => filterJobs(jobs, activeFilter),
    [jobs, activeFilter]
  )

  // Filter jobs for Saved tab (apply active filter too)
  const savedJobs = useMemo(() => {
    const baseList = jobs.filter((job) => savedIds.includes(job.id))
    return filterJobs(baseList, activeFilter)
  }, [jobs, savedIds, activeFilter])

  // Filter jobs for Search tab (instant matching + apply active filter)
  const searchedJobs = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    const baseList = query
      ? jobs.filter(
          (job) =>
            job.organization.toLowerCase().includes(query) ||
            job.postName.toLowerCase().includes(query)
        )
      : jobs
    return filterJobs(baseList, activeFilter)
  }, [jobs, searchQuery, activeFilter])

  if (tab === "about") {
    return (
      <section key={tab} className="px-4 py-4 animate-tab-transition">
        <About />
      </section>
    )
  }

  if (tab === "search") {
    return (
      <section key={tab} className="px-4 py-4 animate-tab-transition">
        <div className="flex flex-col gap-4">
          {/* M3 Search Bar */}
          <div className="flex items-center gap-3 rounded-full bg-surface-container border border-outline-variant/30 px-3 h-12 shadow-sm focus-within:border-primary focus-within:shadow-md transition-all">
            <button
              onClick={() => {
                router.push("/?tab=home")
              }}
              className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition active:scale-95"
              aria-label="Back to home"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 bg-transparent border-none text-[14px] outline-none text-on-surface placeholder:text-on-surface-variant/60 w-full"
              autoFocus
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="p-1.5 rounded-full hover:bg-surface-container-high text-on-surface-variant transition active:scale-95"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Deadline Filter Chips */}
          <FilterChips activeFilter={activeFilter} onChange={handleFilterChange} />

          <div className="flex items-center justify-between px-1">
            <p className="text-[13px] font-bold text-on-surface-variant/80">
              {formatNumber(searchedJobs.length)} {t("jobsAvailable")}
            </p>
          </div>

          {searchedJobs.length === 0 ? (
            <div className="flex min-h-[35vh] flex-col items-center justify-center text-center px-4">
              <Search className="h-12 w-12 text-on-surface-variant/40" />
              <h3 className="mt-4 text-[16px] font-bold text-on-surface">
                {t("noPositions")}
              </h3>
              <p className="mt-2 text-[13px] font-semibold text-on-surface-variant/70">
                {t("tryDifferentFilter")}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {searchedJobs.map((job) => (
                <JobCard key={job.id} job={job} onTap={setActiveJob} />
              ))}
            </div>
          )}
        </div>

        <JobDrawer
          job={activeJob}
          open={Boolean(activeJob)}
          onClose={() => setActiveJob(null)}
        />
      </section>
    )
  }

  if (tab === "saved") {
    return (
      <section key={tab} className="px-4 py-4 animate-tab-transition">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1 border-b border-outline-variant/10 pb-3">
            <h2 className="font-display text-[18px] font-extrabold text-on-surface flex items-center gap-2">
              <Bookmark className="h-[18px] w-[18px] text-primary" fill="currentColor" />
              {t("navSaved")}
            </h2>
            <p className="text-[12px] font-bold text-on-surface-variant/70 bg-surface-container px-2.5 py-1 rounded-full">
              {formatNumber(savedJobs.length)} {t("postsCount")}
            </p>
          </div>

          {/* Deadline Filter Chips */}
          <FilterChips activeFilter={activeFilter} onChange={handleFilterChange} />

          {savedJobs.length === 0 ? (
            <div className="flex min-h-[35vh] flex-col items-center justify-center text-center px-4">
              <Bookmark className="h-12 w-12 text-on-surface-variant/30" />
              <h3 className="mt-4 text-[16px] font-bold text-on-surface">
                {t("noSavedJobs")}
              </h3>
              <p className="mt-2 text-[12px] font-semibold leading-relaxed text-on-surface-variant/70 max-w-[280px]">
                {t("noSavedJobsDesc")}
              </p>
              <button
                onClick={() => router.push("/?tab=home")}
                className="mt-6 rounded-full bg-primary px-5 py-2.5 text-[13px] font-bold text-on-primary shadow-sm hover:shadow-md active:scale-95 transition"
              >
                {t("browseJobs")}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3.5">
              {savedJobs.map((job) => (
                <JobCard key={job.id} job={job} onTap={setActiveJob} />
              ))}
            </div>
          )}
        </div>

        <JobDrawer
          job={activeJob}
          open={Boolean(activeJob)}
          onClose={() => setActiveJob(null)}
        />
      </section>
    )
  }

  // Home View (Default)
  return (
    <section key={tab} className="px-4 py-4 animate-tab-transition">
      <div className="flex flex-col gap-4">
        {/* Render Hero only on homepage */}
        <Hero count={activeCount} />

        <FilterChips activeFilter={activeFilter} onChange={handleFilterChange} />

        <div className="flex items-center justify-between px-1">
          <p className="text-[13px] font-bold text-on-surface-variant/80">
            {formatNumber(filteredJobs.length)} {t("jobsAvailable")}
          </p>

          <button className="rounded-full bg-primary-container px-3.5 py-1.5 text-xs font-bold text-on-primary-container hover:bg-surface-variant transition active:scale-95">
            {t("latest")}
          </button>
        </div>

        {filteredJobs.length === 0 ? (
          <EmptyState onChange={handleFilterChange} />
        ) : (
          <div className="flex flex-col gap-3.5">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} onTap={setActiveJob} />
            ))}
          </div>
        )}
      </div>

      <JobDrawer
        job={activeJob}
        open={Boolean(activeJob)}
        onClose={() => setActiveJob(null)}
      />
    </section>
  )
}