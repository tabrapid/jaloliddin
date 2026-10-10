"use client";

import { MotionConfig } from "motion/react";
import { useState } from "react";

import { HoverSurface } from "@/components/motion/hover-surface";
import { TextEntrance } from "@/components/motion/text-entrance";
import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ResetIcon } from "@/components/ui/icons";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">Open dialog</Button>
      </DialogTrigger>
      <DialogContent closeLabel="Close dialog" header={<DialogTitle className="text-heading font-semibold">Dialog title</DialogTitle>}>
        <DialogDescription className="text-ink-2">
          Focus moves into the dialog, Tab cycles inside it, Escape closes it and focus returns to the trigger.
        </DialogDescription>
        <div className="mt-6 flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Confirm</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TextEntranceDemo() {
  const [run, setRun] = useState(0);
  return (
    <div className="flex flex-col items-start gap-6">
      <TextEntrance key={`a${run}`} as="p" text="Jaloliddin" className="text-display-lg font-bold text-ink" />
      <TextEntrance key={`b${run}`} as="p" text="Small accents can fade in." variant="rise" className="text-lead text-ink-2" step={70} />
      <Button variant="secondary" size="sm" onClick={() => setRun((value) => value + 1)}>
        <ResetIcon size={16} />
        Replay entrance
      </Button>
    </div>
  );
}

export function ReducedMotionDemo() {
  const prefersReduced = usePrefersReducedMotion();
  return (
    <div className="flex flex-col gap-6">
      <p className="font-mono text-[0.875rem] text-ink-2">
        usePrefersReducedMotion() → <span className="text-accent-glow">{String(prefersReduced)}</span>
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <MotionConfig reducedMotion="never">
          <HoverSurface className="rounded-lg">
            <div className="rounded-lg border border-line-strong p-6">
              <p className="text-label text-ink-3">reducedMotion=&quot;never&quot;</p>
              <p className="mt-2 text-ink">Hover: lifts with a spring.</p>
            </div>
          </HoverSurface>
        </MotionConfig>
        <MotionConfig reducedMotion="always">
          <HoverSurface className="rounded-lg">
            <div className="rounded-lg border border-line-strong p-6">
              <p className="text-label text-ink-3">reducedMotion=&quot;always&quot;</p>
              <p className="mt-2 text-ink">Hover: light follows, no movement.</p>
            </div>
          </HoverSurface>
        </MotionConfig>
      </div>
    </div>
  );
}
