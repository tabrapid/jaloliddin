"use client";

import { useId, useMemo, useState, type KeyboardEvent } from "react";

import { usePrefersReducedMotion } from "@/components/motion/use-reduced-motion";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { PauseIcon, PlayIcon, ResetIcon, ShuffleIcon, StepBackIcon, StepForwardIcon } from "@/components/ui/icons";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { format } from "@/i18n/format";
import { cn } from "@/lib/cn";

import {
  createSortedSample,
  maxComparisons,
  pickMissingValue,
  pickPresentValue,
  traceBinarySearch,
} from "./algorithm";
import { ArrayStrip } from "./array-strip";
import { comparisonsUpTo, explainStep } from "./explain";
import { useStepPlayer } from "./use-step-player";

const LENGTH = 12;
const MAX_VALUE = 99;
const INITIAL_SEED = 11;

export interface BinarySearchVisualizerProps {
  labels: Dictionary["binarySearch"];
}

/**
 * Interactive binary search. All algorithm logic lives in ./algorithm.ts;
 * this component only renders a precomputed trace and controls playback.
 * The initial array comes from a fixed seed, so server and client agree.
 */
export function BinarySearchVisualizer({ labels }: BinarySearchVisualizerProps) {
  const [seed, setSeed] = useState(INITIAL_SEED);
  const array = useMemo(() => createSortedSample(seed, LENGTH, MAX_VALUE), [seed]);
  const [target, setTarget] = useState(() => pickPresentValue(createSortedSample(INITIAL_SEED, LENGTH, MAX_VALUE), 3));
  const [draft, setDraft] = useState(String(target));
  const [error, setError] = useState<string | null>(null);

  const trace = useMemo(() => traceBinarySearch(array, target), [array, target]);

  function handleDraftChange(value: string) {
    setDraft(value);
    const parsed = Number(value);
    if (value.trim() !== "" && Number.isInteger(parsed) && parsed >= 1 && parsed <= MAX_VALUE) {
      setError(null);
      setTarget(parsed);
    } else {
      setError(format(labels.targetError, { min: 1, max: MAX_VALUE }));
    }
  }

  function choose(value: number) {
    setTarget(value);
    setDraft(String(value));
    setError(null);
  }

  function handleNewArray() {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    choose(pickPresentValue(createSortedSample(nextSeed, LENGTH, MAX_VALUE), nextSeed));
  }

  return (
    <div className="flex flex-col gap-8" data-testid="binary-search">
      <div className="grid gap-6 rounded-lg border border-line bg-raised p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
        <Field
          label={labels.targetLabel}
          hint={error ? undefined : format(labels.targetHint, { min: 1, max: MAX_VALUE })}
          error={error ?? undefined}
          className="max-w-xs"
        >
          {(control) => (
            <Input
              {...control}
              inputMode="numeric"
              autoComplete="off"
              value={draft}
              onChange={(event) => handleDraftChange(event.target.value)}
              data-testid="target-input"
            />
          )}
        </Field>
        <div className="flex flex-wrap gap-2 md:pb-7">
          <Button variant="secondary" size="sm" onClick={() => choose(pickPresentValue(array, seed + target))} data-testid="pick-present">
            {labels.pickPresent}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => choose(pickMissingValue(array, seed + target))} data-testid="pick-missing">
            {labels.pickMissing}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleNewArray} data-testid="new-array">
            <ShuffleIcon size={16} />
            {labels.newArray}
          </Button>
        </div>
      </div>

      {/* Remount the player when the search changes so it starts from step one. */}
      <Player key={`${seed}:${target}`} labels={labels} trace={trace} />
    </div>
  );
}

interface PlayerProps {
  labels: Dictionary["binarySearch"];
  trace: ReturnType<typeof traceBinarySearch>;
}

function Player({ labels, trace }: PlayerProps) {
  const reduced = usePrefersReducedMotion();
  const { state, dispatch } = useStepPlayer(trace.steps.length, reduced ? 1600 : 1300);
  const regionId = useId();

  const step = trace.steps[state.index]!;
  const atEnd = state.index === trace.steps.length - 1;
  const comparisons = comparisonsUpTo(trace.steps, state.index);
  const explanation = explainStep(step, trace.target, labels);
  const outcome = !atEnd ? labels.searching : trace.result.found ? labels.found : labels.notFound;
  const summary = atEnd
    ? trace.result.found
      ? format(labels.summaryFound, { target: trace.target, index: trace.result.index, count: trace.result.comparisons })
      : format(labels.summaryNotFound, { target: trace.target, count: trace.result.comparisons })
    : null;
  const range =
    step.kind === "not-found" || step.low > step.high
      ? labels.rangeEmpty
      : format(labels.rangeValue, { low: step.low, high: step.high });

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target instanceof HTMLInputElement) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      dispatch({ type: "next" });
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      dispatch({ type: "previous" });
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div
        role="group"
        aria-labelledby={`${regionId}-label`}
        aria-keyshortcuts="ArrowLeft ArrowRight"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative overflow-hidden rounded-lg border border-line bg-canvas-deep p-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus sm:p-8"
      >
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-3">
          <p id={`${regionId}-label`} className="text-label text-ink-3">
            {labels.arrayLabel} · target = <span className="text-accent-glow">{trace.target}</span>
          </p>
          <p className="text-label text-ink-3" data-testid="step-counter">
            {format(labels.stepCounter, { current: state.index + 1, total: trace.steps.length })}
          </p>
        </div>

        <ArrayStrip
          array={trace.array}
          step={step}
          labels={{ low: labels.pointerLow, mid: labels.pointerMid, high: labels.pointerHigh, index: labels.index }}
        />

        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-small text-ink-3" aria-hidden="true">
          <li className="flex items-center gap-2">
            <span className="size-3 rounded-xs border border-line-strong bg-raised" /> {labels.legendActive}
          </li>
          <li className="flex items-center gap-2">
            <span className="size-3 rounded-xs border border-line" /> {labels.legendEliminated}
          </li>
          <li className="flex items-center gap-2">
            <span className="size-3 rounded-xs border border-accent bg-accent-wash" /> {labels.legendMid}
          </li>
        </ul>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="flex flex-col gap-5">
          <p
            className="min-h-[5.5rem] text-lead text-ink"
            aria-live="polite"
            aria-atomic="true"
            data-testid="step-explanation"
          >
            {explanation}
          </p>
          {summary ? (
            <p
              className={cn(
                "rounded-md border px-4 py-3 text-small",
                trace.result.found ? "border-success/40 text-success" : "border-line-strong text-ink-2",
              )}
              data-testid="search-summary"
            >
              {summary}
            </p>
          ) : null}
        </div>
        <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-3 lg:grid-cols-1">
          <div className="bg-canvas px-4 py-3">
            <dt className="text-label text-ink-3">{labels.comparisons}</dt>
            <dd className="font-mono text-[1.25rem] text-ink" data-testid="comparison-count">
              {comparisons}
              <span className="text-ink-3"> / {maxComparisons(trace.array.length)}</span>
            </dd>
          </div>
          <div className="bg-canvas px-4 py-3">
            <dt className="text-label text-ink-3">{labels.range}</dt>
            <dd className="font-mono text-[0.9375rem] text-ink">{range}</dd>
          </div>
          <div className="bg-canvas px-4 py-3">
            <dt className="text-label text-ink-3">{labels.outcome}</dt>
            <dd
              className={cn(
                "font-mono text-[0.9375rem]",
                atEnd ? (trace.result.found ? "text-success" : "text-danger") : "text-ink",
              )}
              data-testid="search-outcome"
            >
              {outcome}
            </dd>
          </div>
        </dl>
      </div>

      <div role="toolbar" aria-label={labels.controls} className="flex flex-wrap items-center gap-2 border-t border-line pt-6">
        <Button onClick={() => dispatch({ type: "toggle" })} data-testid="play-toggle" className="min-w-32">
          {state.playing ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
          {state.playing ? labels.pause : labels.play}
        </Button>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "previous" })}
          aria-disabled={state.index === 0}
          aria-keyshortcuts="ArrowLeft"
          data-testid="previous-step"
        >
          <StepBackIcon size={16} />
          {labels.previous}
        </Button>
        <Button
          variant="secondary"
          onClick={() => dispatch({ type: "next" })}
          aria-disabled={atEnd}
          aria-keyshortcuts="ArrowRight"
          data-testid="next-step"
        >
          {labels.next}
          <StepForwardIcon size={16} />
        </Button>
        <Button
          variant="ghost"
          onClick={() => dispatch({ type: "reset" })}
          aria-disabled={state.index === 0 && !state.playing}
          data-testid="reset"
        >
          <ResetIcon size={16} />
          {labels.reset}
        </Button>
      </div>
    </div>
  );
}
