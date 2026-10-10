"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

import { buttonClasses, type ButtonSize, type ButtonVariant } from "./button";
import { CheckIcon, CopyIcon } from "./icons";

type CopyState = "idle" | "copied" | "error";

export interface CopyButtonProps {
  /** Text placed on the clipboard. */
  value: string;
  labels: { copy: string; copied: string; error: string };
  /** Extra context for screen readers, e.g. "email address". */
  srContext?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

async function writeToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  // Fallback for non-secure contexts.
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  if (!ok) throw new Error("Copy command failed");
}

/** Copies text and announces the result through a polite live region. */
export function CopyButton({ value, labels, srContext, variant = "secondary", size = "sm", className }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function handleClick() {
    clearTimeout(timer.current);
    try {
      await writeToClipboard(value);
      setState("copied");
    } catch {
      setState("error");
    }
    timer.current = setTimeout(() => setState("idle"), 2000);
  }

  const label = state === "copied" ? labels.copied : state === "error" ? labels.error : labels.copy;

  return (
    <>
      <button type="button" onClick={handleClick} className={buttonClasses({ variant, size, className: cn("min-w-24", className) })}>
        {state === "copied" ? <CheckIcon size={16} className="text-success" /> : <CopyIcon size={16} />}
        <span aria-hidden="true">{label}</span>
        <span className="sr-only">
          {labels.copy}
          {srContext ? ` ${srContext}` : ""}
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "idle" ? "" : label}
      </span>
    </>
  );
}
