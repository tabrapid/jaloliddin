"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/cn";

import { PlusIcon } from "./icons";

/**
 * Disclosure list (WAI-ARIA accordion via Radix). Triggers are real buttons
 * inside headings; content stays in the DOM for in-page search when closed.
 */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
  return <AccordionPrimitive.Item className={cn("border-b border-line", className)} {...props} />;
}

export interface AccordionTriggerProps extends ComponentProps<typeof AccordionPrimitive.Trigger> {
  /** Optional leading element, e.g. an index number. */
  leading?: ReactNode;
  /** Heading level wrapping the trigger. */
  headingLevel?: 2 | 3 | 4;
}

export function AccordionTrigger({ className, children, leading, headingLevel = 3, ...props }: AccordionTriggerProps) {
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";
  return (
    <AccordionPrimitive.Header asChild>
      <Heading className="flex">
        <AccordionPrimitive.Trigger
          className={cn(
            "group/trigger flex min-h-14 w-full items-center gap-5 py-5 text-left text-[1.1875rem] font-semibold tracking-[-0.01em] text-ink",
            "transition-colors duration-200 hover:text-accent-glow",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
            className,
          )}
          {...props}
        >
          {leading ? <span className="text-label w-8 shrink-0 text-ink-3">{leading}</span> : null}
          <span className="flex-1">{children}</span>
          <PlusIcon className="shrink-0 text-ink-3 transition-transform duration-300 ease-out-expo group-data-[state=open]/trigger:rotate-45" />
        </AccordionPrimitive.Trigger>
      </Heading>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({ className, children, ...props }: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "overflow-hidden text-ink-2 data-[state=closed]:animate-[accordion-up_220ms_var(--ease-out-expo)] data-[state=open]:animate-[accordion-down_320ms_var(--ease-out-expo)]",
        className,
      )}
      {...props}
    >
      <div className="max-w-[62ch] pb-6 md:pl-13">{children}</div>
    </AccordionPrimitive.Content>
  );
}
