"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogPopup,
  DialogTitle,
} from "@/components/ui/dialog"

type ResetConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export function ResetConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: ResetConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="space-y-4">
        <div className="space-y-1">
          <DialogTitle>Start a new game?</DialogTitle>
          <DialogDescription>
            This clears all scores and used cards. It cannot be undone.
          </DialogDescription>
        </div>
        <div className="flex justify-end gap-2">
          <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Reset game
          </Button>
        </div>
      </DialogPopup>
    </Dialog>
  )
}
