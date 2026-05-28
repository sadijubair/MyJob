"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

const Sheet = Dialog.Root
const SheetTrigger = Dialog.Trigger
const SheetClose = Dialog.Close

const SheetPortal = Dialog.Portal

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]", className)}
    {...props}
  />
))
SheetOverlay.displayName = Dialog.Overlay.displayName

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content> & { side?: "top" | "right" | "bottom" | "left" }
>(({ side = "right", className, children, ...props }, ref) => {
  const sideClasses: Record<"top" | "right" | "bottom" | "left", string> = {
    top: "inset-x-0 top-0 h-auto rounded-b-[24px] border-b",
    right: "inset-y-0 right-0 h-full w-full max-w-sm border-l",
    bottom: "inset-x-0 bottom-0 h-auto rounded-t-[24px] border-t",
    left: "inset-y-0 left-0 h-full w-full max-w-sm border-r",
  }

  return (
    <SheetPortal>
      <SheetOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(
          "fixed z-50 bg-white shadow-[0_-16px_48px_rgba(15,10,10,0.12)] outline-none",
          sideClasses[side],
          className,
        )}
        {...props}
      >
        {children}
      </Dialog.Content>
    </SheetPortal>
  )
})
SheetContent.displayName = Dialog.Content.displayName

export { Sheet, SheetTrigger, SheetClose, SheetContent }