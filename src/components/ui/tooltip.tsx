"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ReactElement, ReactNode } from "react";

/**
 * Supplementary hint for a control that already has an accessible name.
 * Opens on hover and keyboard focus. Never put essential information only in
 * a tooltip: touch devices may not show it.
 */
export interface TooltipProps {
  content: ReactNode;
  /** A single focusable element (button, link). */
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}

export function Tooltip({ content, children, side = "top", delayDuration = 250 }: TooltipProps) {
  return (
    <TooltipPrimitive.Provider delayDuration={delayDuration}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side={side}
            sideOffset={8}
            className="text-label z-50 max-w-64 rounded-sm border border-line-strong bg-surface-strong px-2.5 py-1.5 normal-case tracking-normal text-ink shadow-raised data-[state=delayed-open]:animate-[fade-in_160ms_ease-out]"
          >
            {content}
            <TooltipPrimitive.Arrow className="fill-surface-strong" />
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
