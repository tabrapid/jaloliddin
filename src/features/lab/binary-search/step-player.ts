/**
 * Pure state machine for stepping through a precomputed sequence.
 * The React hook (use-step-player.ts) adds the autoplay timer.
 */
export interface StepPlayerState {
  index: number;
  total: number;
  playing: boolean;
}

export type StepPlayerAction =
  | { type: "next" }
  | { type: "previous" }
  | { type: "play" }
  | { type: "pause" }
  | { type: "toggle" }
  | { type: "reset"; total?: number }
  | { type: "tick" };

export function createStepPlayerState(total: number): StepPlayerState {
  return { index: 0, total: Math.max(1, total), playing: false };
}

const last = (state: StepPlayerState) => state.total - 1;

export function stepPlayerReducer(state: StepPlayerState, action: StepPlayerAction): StepPlayerState {
  switch (action.type) {
    case "next":
      return { ...state, index: Math.min(last(state), state.index + 1), playing: false };
    case "previous":
      return { ...state, index: Math.max(0, state.index - 1), playing: false };
    case "play":
      // Playing from the end restarts from the beginning.
      return { ...state, index: state.index >= last(state) ? 0 : state.index, playing: last(state) > 0 };
    case "pause":
      return { ...state, playing: false };
    case "toggle":
      return stepPlayerReducer(state, { type: state.playing ? "pause" : "play" });
    case "tick": {
      if (!state.playing) return state;
      const index = Math.min(last(state), state.index + 1);
      return { ...state, index, playing: index < last(state) };
    }
    case "reset":
      return createStepPlayerState(action.total ?? state.total);
  }
}
