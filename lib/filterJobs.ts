import type { FilterType, Job } from "@/lib/types"

export function filterJobs(jobs: Job[], filter: FilterType): Job[] {
  return jobs.filter((job) => {
    switch (filter) {
      case "today":
        return job.daysLeft === 0
      case "3days":
        return job.daysLeft >= 0 && job.daysLeft <= 3
      case "7days":
        return job.daysLeft >= 0 && job.daysLeft <= 7
      case "expired":
        return job.daysLeft < 0
      case "all":
      default:
        return job.daysLeft >= 0
    }
  })
}