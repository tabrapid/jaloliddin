// @vitest-environment jsdom
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, describe, expect, it, vi } from "vitest";

import { en } from "@/i18n/dictionaries/en";

import { BinarySearchVisualizer } from "./binary-search-visualizer";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

const setup = () => {
  const user = userEvent.setup();
  render(<BinarySearchVisualizer labels={en.binarySearch} />);
  return { user };
};

describe("BinarySearchVisualizer", () => {
  it("starts at step one with an explanation", () => {
    setup();
    expect(screen.getByTestId("step-counter")).toHaveTextContent(/^Step 1 of \d+$/);
    expect(screen.getByTestId("step-explanation")).toHaveTextContent(/The whole array is in play: low = 0, high = 11/);
    expect(screen.getByTestId("previous-step")).toHaveAttribute("aria-disabled", "true");
  });

  it("steps to a found outcome with Next and back with Previous", async () => {
    const { user } = setup();
    const next = screen.getByRole("button", { name: /next step/i });
    for (let i = 0; i < 10 && next.getAttribute("aria-disabled") !== "true"; i++) await user.click(next);
    expect(screen.getByTestId("search-outcome")).toHaveTextContent("Found");
    expect(screen.getByTestId("search-summary")).toHaveTextContent(/^Found \d+ at index \d+ after \d+ comparisons\.$/);
    expect(next).toHaveFocus();

    await user.click(screen.getByRole("button", { name: /previous step/i }));
    expect(screen.getByTestId("search-outcome")).toHaveTextContent("Searching");
  });

  it("reports a missing value as not found", async () => {
    const { user } = setup();
    await user.click(screen.getByTestId("pick-missing"));
    const next = screen.getByTestId("next-step");
    for (let i = 0; i < 10 && next.getAttribute("aria-disabled") !== "true"; i++) await user.click(next);
    expect(screen.getByTestId("search-outcome")).toHaveTextContent("Not found");
    expect(screen.getByTestId("step-explanation")).toHaveTextContent(/is not in the array/);
  });

  it("validates the target input without losing focus", async () => {
    const { user } = setup();
    const input = screen.getByLabelText("Target value");
    await user.clear(input);
    await user.type(input, "abc");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a whole number from 1 to 99.");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveFocus();
    await user.clear(input);
    await user.type(input, "42");
    expect(screen.queryByRole("alert")).toBeNull();
    expect(input).toHaveFocus();
    expect(screen.getByText(/Sorted array · Target value:/)).toHaveTextContent("42");
  });

  it("plays automatically, can pause, and resets", async () => {
    vi.useFakeTimers();
    try {
      render(<BinarySearchVisualizer labels={en.binarySearch} />);
      fireEvent.click(screen.getByTestId("play-toggle"));
      expect(screen.getByTestId("play-toggle")).toHaveTextContent("Pause");
      act(() => vi.advanceTimersByTime(1300));
      expect(screen.getByTestId("step-counter")).toHaveTextContent(/^Step 2 of/);
      fireEvent.click(screen.getByTestId("play-toggle"));
      act(() => vi.advanceTimersByTime(5000));
      expect(screen.getByTestId("step-counter")).toHaveTextContent(/^Step 2 of/);
      fireEvent.click(screen.getByTestId("reset"));
      expect(screen.getByTestId("step-counter")).toHaveTextContent(/^Step 1 of/);
    } finally {
      vi.useRealTimers();
    }
  });

  it("supports arrow keys on the array region", async () => {
    const { user } = setup();
    const region = screen.getByRole("group", { name: /sorted array/i });
    region.focus();
    await user.keyboard("{ArrowRight}");
    expect(screen.getByTestId("step-counter")).toHaveTextContent(/^Step 2 of/);
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByTestId("step-counter")).toHaveTextContent(/^Step 1 of/);
  });
});
