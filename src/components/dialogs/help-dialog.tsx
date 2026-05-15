"use client";

import { XIcon } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogPopup, DialogTitle } from "@/components/ui/dialog";
import { Rules } from "@/components/rules";

type HelpDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HelpDialog({ open, onOpenChange }: HelpDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPopup className="p-0">
        <header className="flex items-center justify-between px-6 py-4">
          <DialogTitle>How to play</DialogTitle>
          <DialogClose render={<Button variant="ghost" size="icon" aria-label="Close help" />}>
            <XIcon className="size-4" weight="regular" />
          </DialogClose>
        </header>
        <div className="px-6 pb-6">
          <Rules />
        </div>
      </DialogPopup>
    </Dialog>
  );
}
