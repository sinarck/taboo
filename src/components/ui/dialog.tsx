"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import type React from "react"
import { cn } from "@/utils/cn"

export const Dialog: typeof DialogPrimitive.Root = DialogPrimitive.Root
export const DialogPortal: typeof DialogPrimitive.Portal = DialogPrimitive.Portal

export function DialogTrigger(
  props: DialogPrimitive.Trigger.Props,
): React.ReactElement {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

export function DialogClose(
  props: DialogPrimitive.Close.Props,
): React.ReactElement {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

export function DialogBackdrop({
  className,
  ...props
}: DialogPrimitive.Backdrop.Props): React.ReactElement {
  return (
    <DialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/50 transition-opacity duration-150 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      data-slot="dialog-backdrop"
      {...props}
    />
  )
}

export function DialogPopup({
  className,
  ...props
}: DialogPrimitive.Popup.Props): React.ReactElement {
  return (
    <DialogPortal>
      <DialogBackdrop />
      <DialogPrimitive.Popup
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-popover p-6 text-foreground transition-opacity duration-150 ease-out data-ending-style:opacity-0 data-starting-style:opacity-0 max-sm:max-w-none max-sm:inset-x-4",
          className,
        )}
        data-slot="dialog-popup"
        {...props}
      />
    </DialogPortal>
  )
}

export function DialogTitle({
  className,
  ...props
}: DialogPrimitive.Title.Props): React.ReactElement {
  return (
    <DialogPrimitive.Title
      className={cn("text-base font-semibold tracking-tight", className)}
      data-slot="dialog-title"
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: DialogPrimitive.Description.Props): React.ReactElement {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="dialog-description"
      {...props}
    />
  )
}

export { DialogPrimitive }
