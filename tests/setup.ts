import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";

afterEach(async () => {
  // Unmount React trees between DOM tests (no-op for node tests).
  if (typeof document !== "undefined") {
    const { cleanup } = await import("@testing-library/react");
    cleanup();
  }
});
