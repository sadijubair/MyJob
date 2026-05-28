// app/page.tsx

import { JobGrid } from "@/components/JobGrid"
import { getJobs } from "@/lib/getJobs"
import { Suspense } from "react"

export const revalidate = 3600

export default async function FrontendPage() {
  const jobs = await getJobs()

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex w-full max-w-[480px] flex-col pb-12">
        <Suspense fallback={null}>
          <JobGrid jobs={jobs} />
        </Suspense>
      </div>
    </main>
  )
}