import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, Ref } from "react";

import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "link";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const base =
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap font-medium " +
  "transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out-expo " +
  "disabled:pointer-events-none disabled:opacity-45 aria-disabled:cursor-not-allowed aria-disabled:opacity-45 active:translate-y-px " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus";

const variants: Record<ButtonVariant, string> = {
  primary:
    "rounded-pill bg-action text-on-accent shadow-[inset_0_1px_0_rgb(255_255_255/0.18)] hover:bg-action-hover hover:shadow-glow",
  secondary:
    "rounded-pill border border-line-strong bg-transparent text-ink hover:border-silver hover:bg-surface",
  ghost: "rounded-pill text-ink-2 hover:bg-surface hover:text-ink",
  link: "rounded-xs px-0 text-ink underline decoration-line-strong underline-offset-[0.3em] hover:decoration-accent-ink",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-9 px-3.5 text-small",
  md: "min-h-11 px-5 text-[0.9875rem]",
  lg: "min-h-13 px-7 text-[1.0625rem]",
  icon: "size-11 rounded-pill p-0",
};

export interface ButtonStyleOptions {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

/** Class names for a button-styled element. Useful when a wrapper is not possible. */
export function buttonClasses({ variant = "primary", size = "md", className }: ButtonStyleOptions = {}) {
  // The link variant ignores horizontal padding so it aligns with body text.
  const sizeClass = variant === "link" && size !== "icon" ? sizes[size].replace(/px-\S+/, "") : sizes[size];
  return cn(base, variants[variant], sizeClass, className);
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonStyleOptions {
  /**
   * Render the single child element (e.g. a router Link or <a>) with button
   * styles instead of a <button>. Keeps the component router-agnostic.
   */
  asChild?: boolean;
  ref?: Ref<HTMLButtonElement>;
}

export function Button({ asChild = false, variant, size, className, type, ref, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      ref={ref}
      className={buttonClasses({ variant, size, className })}
      {...(asChild ? {} : { type: type ?? "button" })}
      {...props}
    />
  );
}
