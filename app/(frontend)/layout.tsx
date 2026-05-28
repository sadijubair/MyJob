import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Suspense } from "react"

import { Plus_Jakarta_Sans, Outfit } from "next/font/google"

import { BottomNav } from "@/components/BottomNav"
import { MobileHeader } from "@/components/MobileHeader"
import { getJobs } from "@/lib/getJobs"
import { Toaster } from "@/components/ui/sonner"
import { cn } from "@/lib/utils"
import { LanguageProvider } from "@/lib/language"
import { SavedJobsProvider } from "@/lib/savedJobs"

import "./globals.css"

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const display = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
})

export const metadata: Metadata = {
  title: {
    default: "MyJob",
    template: "%s | MyJob",
  },
  description: "MyJob is a mobile-first deadline tracker for Bangladesh job seekers.",
  manifest: "/manifest.json",
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const jobs = await getJobs()

  return (
    <html lang="en" className={cn("antialiased", sans.variable, display.variable)}>
      <body className="bg-surface text-ink">
        <LanguageProvider>
          <SavedJobsProvider>
            <div className="min-h-dvh bg-surface text-ink pb-24">
              <MobileHeader jobs={jobs} />
              <div className="pt-16">{children}</div>
              <Suspense fallback={null}>
                <BottomNav />
              </Suspense>
              <Toaster richColors position="top-center" />
            </div>
          </SavedJobsProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}