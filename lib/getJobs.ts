import { cache } from "react"
import { differenceInCalendarDays, parseISO } from "date-fns"
import { getPayload } from "payload"

import config from "@payload-config"

import type { Job, Urgency } from "@/lib/types"

function getUrgency(daysLeft: number): Urgency {
  if (daysLeft < 0) {
    return "expired"
  }

  if (daysLeft === 0) {
    return "today"
  }

  if (daysLeft <= 3) {
    return "urgent"
  }

  if (daysLeft <= 7) {
    return "warning"
  }

  return "ok"
}

export const getJobs = cache(async function getJobs(): Promise<Job[]> {
  if (!process.env.DATABASE_URI) {
    console.warn("[getJobs] DATABASE_URI is not set — returning empty jobs array.")
    return []
  }

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: "jobs",
      limit: 500,
      sort: "deadline",
    })

    const today = new Date()

    return result.docs
      .map((doc) => {
        const deadline = parseISO(String(doc.deadline))
        const daysLeft = differenceInCalendarDays(deadline, today)

        return {
          id: String(doc.id),
          organization: doc.organization,
          postName: doc.postName,
          numberOfPosts: doc.numberOfPosts,
          payGrade: doc.payGrade ?? undefined,
          circularLink: doc.circularLink ?? undefined,
          applicationFee: doc.applicationFee ?? undefined,
          applicationLink: doc.applicationLink,
          deadline: deadline.toISOString(),
          daysLeft,
          urgency: getUrgency(daysLeft),
        }
      })
      .filter((job) => job.daysLeft >= -5)
  } catch (error) {
    console.error("[getJobs] Failed to fetch jobs from database:", error)
    return []
  }
})