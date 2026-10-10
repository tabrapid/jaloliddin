export function SkipLink({ label, target = "main-content" }: { label: string; target?: string }) {
  return (
    <a
      href={`#${target}`}
      className="fixed top-3 left-3 z-[60] -translate-y-24 rounded-pill bg-ink px-5 py-3 font-medium text-canvas shadow-raised transition-transform focus:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
    >
      {label}
    </a>
  );
}
