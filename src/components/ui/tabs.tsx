"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";

import { cn } from "@/lib/cn";

/**
 * Accessible tabs (WAI-ARIA tabs pattern via Radix): arrow keys move between
 * triggers, Home/End jump, and only the active panel is in the tab order.
 */
export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("flex flex-wrap gap-x-6 gap-y-2 border-b border-line", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "text-label relative -mb-px min-h-11 border-b-2 border-transparent py-3 text-ink-3 transition-colors duration-200",
        "hover:text-ink data-[state=active]:border-accent data-[state=active]:text-ink",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("pt-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus", className)}
      {...props}
    />
  );
}
