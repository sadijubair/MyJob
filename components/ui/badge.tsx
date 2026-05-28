import * as React from "react"

import { cn } from "@/lib/utils"

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "rose" | "amber" | "green" | "slate" | "outline"
}

export function Badge({ className, tone = "outline", ...props }: BadgeProps) {
  const toneClasses: Record<NonNullable<BadgeProps["tone"]>, string> = {
    rose: "bg-m3-rose-container text-m3-on-rose-container font-semibold",
    amber: "bg-m3-amber-container text-m3-on-amber-container font-semibold",
    green: "bg-m3-emerald-container text-m3-on-emerald-container font-semibold",
    slate: "bg-m3-slate-container text-m3-on-slate-container font-semibold",
    outline: "border border-outline-variant/60 text-on-surface-variant/80 bg-transparent",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide transition-all",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}