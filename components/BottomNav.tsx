"use client"

import type { LucideIcon } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import {
  Bookmark,
  Home,
  Info,
  Search,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { useLanguage } from "@/lib/language"

type NavKey =
  | "home"
  | "search"
  | "saved"
  | "about"

const items: Array<{
  key: NavKey
  icon: LucideIcon
}> = [
  {
    key: "home",
    icon: Home,
  },
  {
    key: "search",
    icon: Search,
  },
  {
    key: "saved",
    icon: Bookmark,
  },
  {
    key: "about",
    icon: Info,
  },
]

export function BottomNav() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()

  const activeTab = (searchParams.get("tab") as NavKey) || "home"

  function handleTap(key: NavKey) {
    router.push(`/?tab=${key}`)
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-outline-variant/20 bg-surface/95 backdrop-blur-md transition-colors">
      <div className="mx-auto grid h-[80px] w-full max-w-[480px] grid-cols-4 px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const isActive = activeTab === item.key
          const Icon = item.icon
          const translationKey = `nav${item.key.charAt(0).toUpperCase() + item.key.slice(1)}`

          return (
            <button
              key={item.key}
              type="button"
              onClick={() => handleTap(item.key)}
              className="flex flex-col items-center justify-center gap-1.5"
            >
              {/* Material 3 Pill Active Indicator Container */}
              <div
                className={cn(
                  "flex h-8 w-16 items-center justify-center rounded-full transition-all duration-200 ease-out",
                  isActive
                    ? "bg-primary-container text-on-primary-container scale-105"
                    : "text-on-surface-variant/80 hover:bg-surface-variant/35"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>

              <span
                className={cn(
                  "text-[11px] font-semibold tracking-wide transition-colors duration-200",
                  isActive
                    ? "text-primary font-bold"
                    : "text-on-surface-variant/70"
                )}
              >
                {t(translationKey)}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}