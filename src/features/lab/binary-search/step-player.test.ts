import { describe, expect, it } from "vitest";

import { createStepPlayerState, stepPlayerReducer, type StepPlayerState } from "./step-player";

const run = (state: StepPlayerState, ...types: Parameters<typeof stepPlayerReducer>[1]["type"][]) =>
  types.reduce((current, type) => stepPlayerReducer(current, { type } as never), state);

describe("stepPlayerReducer", () => {
  it("moves within bounds", () => {
    const start = createStepPlayerState(3);
    expect(run(start, "previous").index).toBe(0);
    expect(run(start, "next", "next", "next", "next").index).toBe(2);
    expect(run(start, "next", "next", "previous").index).toBe(1);
  });

  it("autoplays to the end and stops", () => {
    let state = run(createStepPlayerState(3), "play");
    expect(state.playing).toBe(true);
    state = run(state, "tick");
    expect(state).toMatchObject({ index: 1, playing: true });
    state = run(state, "tick");
    expect(state).toMatchObject({ index: 2, playing: false });
    expect(run(state, "tick").index).toBe(2);
  });

  it("restarts when play is pressed at the end", () => {
    const end = run(createStepPlayerState(3), "next", "next");
    expect(run(end, "play")).toMatchObject({ index: 0, playing: true });
  });

  it("manual stepping and pause stop playback", () => {
    const playing = run(createStepPlayerState(4), "play");
    expect(run(playing, "next").playing).toBe(false);
    expect(run(playing, "pause").playing).toBe(false);
    expect(run(playing, "toggle").playing).toBe(false);
  });

  it("resets to the first step", () => {
    expect(run(createStepPlayerState(4), "next", "play", "reset")).toEqual(createStepPlayerState(4));
  });

  it("does not play a single-step sequence", () => {
    expect(run(createStepPlayerState(1), "play").playing).toBe(false);
  });
});
