"use client"

import * as React from "react"
import * as Dialog from "@radix-ui/react-dialog"

import { cn } from "@/lib/utils"

const Drawer = Dialog.Root
const DrawerTrigger = Dialog.Trigger
const DrawerClose = Dialog.Close

const DrawerPortal = Dialog.Portal

const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof Dialog.Overlay>,
  React.ComponentPropsWithoutRef<typeof Dialog.Overlay>
>(({ className, ...props }, ref) => (
  <Dialog.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/35 backdrop-blur-[2px]", className)}
    {...props}
  />
))
DrawerOverlay.displayName = Dialog.Overlay.displayName

const DrawerContent = React.forwardRef<
  React.ElementRef<typeof Dialog.Content>,
  React.ComponentPropsWithoutRef<typeof Dialog.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <Dialog.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[480px] rounded-t-[32px] border-t border-outline-variant/20 bg-surface text-on-surface shadow-[0_-8px_32px_rgba(0,0,0,0.12)] outline-none transition-colors",
        className,
      )}
      {...props}
    >
      {children}
    </Dialog.Content>
  </DrawerPortal>
))
DrawerContent.displayName = Dialog.Content.displayName

export {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
}