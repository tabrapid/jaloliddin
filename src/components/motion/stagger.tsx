"use client";

import { Children, type ReactNode } from "react";

import { Reveal } from "./reveal";

export interface StaggerProps {
  children: ReactNode;
  /** Seconds between consecutive children. */
  step?: number;
  /** Element used to wrap each child. Use "li" inside lists. */
  itemAs?: "div" | "li" | "article";
  itemClassName?: string;
}

/** Reveals each child in sequence. Inherits all of Reveal's safety rules. */
export function Stagger({ children, step = 0.08, itemAs = "div", itemClassName }: StaggerProps) {
  return (
    <>
      {Children.toArray(children).map((child, index) => (
        <Reveal key={index} as={itemAs} delay={index * step} className={itemClassName}>
          {child}
        </Reveal>
      ))}
    </>
  );
}
