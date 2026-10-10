import { notFound } from "next/navigation";

/**
 * Component explorer — development only.
 * In production builds `process.env.NODE_ENV` is inlined as "production", so
 * the branch (and the dynamic import of the explorer) is removed as dead
 * code; src/proxy.ts additionally sends /explorer to the localized 404.
 */
export default async function ExplorerPage() {
  if (process.env.NODE_ENV === "development") {
    const { Explorer } = await import("@/features/explorer/explorer");
    return <Explorer />;
  }
  notFound();
}
