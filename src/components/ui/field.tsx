import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from "react";

import { cn } from "@/lib/cn";

export interface FieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: true;
}

export interface FieldProps {
  label: ReactNode;
  /** Persistent helper text, announced with the control. */
  hint?: ReactNode;
  /** Error message; when present the control is marked invalid. */
  error?: ReactNode;
  className?: string;
  /** Receives the ids/aria props to spread onto the form control. */
  children: (control: FieldControlProps) => ReactNode;
}

/**
 * Wires a label, hint and error message to any form control.
 * Works with native inputs, selects and textareas.
 */
export function Field({ label, hint, error, className, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-label text-ink-2">
        {label}
      </label>
      {children({ id, "aria-describedby": describedBy, ...(error ? { "aria-invalid": true as const } : {}) })}
      {hint ? (
        <p id={hintId} className="text-small text-ink-3">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-small text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>;
}

export function Input({ className, ref, ...props }: InputProps) {
  return (
    <input
      ref={ref}
      className={cn(
        "min-h-11 w-full rounded-md border border-line-strong bg-canvas-deep px-3.5 font-mono text-[1rem] text-ink",
        "placeholder:text-ink-3 transition-colors duration-200 hover:border-silver-dim",
        "focus-visible:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        "aria-invalid:border-danger disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
