"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { CloseIcon } from "./icons";

/**
 * Modal dialog (Radix): traps focus, restores it to the trigger on close,
 * closes on Escape and marks the rest of the page inert for screen readers.
 */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;

export type DialogLayout = "center" | "sheet";

const layouts: Record<DialogLayout, string> = {
  center:
    "left-1/2 top-1/2 w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-line-strong bg-raised p-6 shadow-raised sm:p-8",
  sheet: "inset-0 flex flex-col bg-canvas/97 p-0",
};

export interface DialogContentProps extends ComponentProps<typeof DialogPrimitive.Content> {
  layout?: DialogLayout;
  /** Accessible label for the built-in close button. */
  closeLabel: string;
  /** Rendered in the top bar next to the close button (sheet layout). */
  header?: ReactNode;
}

export function DialogContent({ layout = "center", closeLabel, header, className, children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-canvas-deep/70 backdrop-blur-sm data-[state=open]:animate-[fade-in_200ms_ease-out]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed z-50 text-ink focus:outline-none data-[state=open]:animate-[fade-in_220ms_ease-out]",
          layouts[layout],
          className,
        )}
        {...props}
      >
        <div className={cn("flex items-center justify-between gap-4", layout === "sheet" ? "min-h-18 px-gutter" : "mb-4")}>
          <div className="min-w-0 flex-1">{header}</div>
          <DialogPrimitive.Close
            className="inline-flex size-11 items-center justify-center rounded-pill border border-line-strong text-ink transition-colors hover:border-silver hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            <CloseIcon />
            <span className="sr-only">{closeLabel}</span>
          </DialogPrimitive.Close>
        </div>
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
