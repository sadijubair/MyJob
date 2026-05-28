"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

type SavedJobsContextType = {
  savedIds: string[]
  saveJob: (id: string) => void
  unsaveJob: (id: string) => void
  isSaved: (id: string) => boolean
}

const SavedJobsContext = createContext<SavedJobsContextType | undefined>(undefined)

export function SavedJobsProvider({ children }: { children: React.ReactNode }) {
  const [savedIds, setSavedIds] = useState<string[]>([])

  // Load from localStorage on mount (prevents hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem("savedJobs")
    if (saved) {
      try {
        setSavedIds(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to parse saved jobs", e)
      }
    }
  }, [])

  const saveJob = (id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      localStorage.setItem("savedJobs", JSON.stringify(next))
      return next
    })
  }

  const unsaveJob = (id: string) => {
    setSavedIds((prev) => {
      const next = prev.filter((x) => x !== id)
      localStorage.setItem("savedJobs", JSON.stringify(next))
      return next
    })
  }

  const isSaved = (id: string) => savedIds.includes(id)

  return (
    <SavedJobsContext.Provider value={{ savedIds, saveJob, unsaveJob, isSaved }}>
      {children}
    </SavedJobsContext.Provider>
  )
}

export function useSavedJobs() {
  const context = useContext(SavedJobsContext)
  if (context === undefined) {
    throw new Error("useSavedJobs must be used within a SavedJobsProvider")
  }
  return context
}
