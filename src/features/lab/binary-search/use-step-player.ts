"use client";

import { useEffect, useReducer } from "react";

import { createStepPlayerState, stepPlayerReducer } from "./step-player";

/**
 * Steps through `total` frames with optional autoplay.
 * Autoplay advances every `intervalMs` and stops on the last frame.
 */
export function useStepPlayer(total: number, intervalMs: number) {
  const [state, dispatch] = useReducer(stepPlayerReducer, total, createStepPlayerState);

  useEffect(() => {
    if (!state.playing) return;
    const id = setInterval(() => dispatch({ type: "tick" }), intervalMs);
    return () => clearInterval(id);
  }, [state.playing, intervalMs]);

  return { state, dispatch };
}
