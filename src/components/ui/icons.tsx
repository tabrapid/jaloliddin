import type { SVGProps } from "react";

/**
 * Minimal 20×20 stroke icon set. Icons are decorative by default
 * (aria-hidden); give the parent control an accessible name instead.
 */
type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 20, children, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  );
}

export const ArrowRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 10h13M11.5 5l5 5-5 5" />
  </Icon>
);

export const ArrowUpRightIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6 14 14 6M7.5 6H14v6.5" />
  </Icon>
);

export const ArrowLeftIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M16.5 10h-13M8.5 5l-5 5 5 5" />
  </Icon>
);

export const ArrowUpIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 16.5v-13M5 8.5l5-5 5 5" />
  </Icon>
);

export const CopyIcon = (props: IconProps) => (
  <Icon {...props}>
    <rect x="7" y="7" width="9.5" height="9.5" rx="1.5" />
    <path d="M13 7V5a1.5 1.5 0 0 0-1.5-1.5h-6A1.5 1.5 0 0 0 4 5v6.5A1.5 1.5 0 0 0 5.5 13H7" />
  </Icon>
);

export const CheckIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m4.5 10.5 3.5 3.5 7.5-8" />
  </Icon>
);

export const PlayIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M6.5 4.5v11l9-5.5-9-5.5Z" fill="currentColor" stroke="none" />
  </Icon>
);

export const PauseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M7 4.5v11M13 4.5v11" strokeWidth={2.25} />
  </Icon>
);

export const StepForwardIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M5 4.5v11l7.5-5.5L5 4.5Z" fill="currentColor" stroke="none" />
    <path d="M15 4.5v11" strokeWidth={2} />
  </Icon>
);

export const StepBackIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M15 4.5v11L7.5 10 15 4.5Z" fill="currentColor" stroke="none" />
    <path d="M5 4.5v11" strokeWidth={2} />
  </Icon>
);

export const ResetIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M4 10a6 6 0 1 0 1.8-4.3M4 3.5v3.5h3.5" />
  </Icon>
);

export const ShuffleIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3.5 6h2.7c1.4 0 2.6.7 3.4 1.9l1.8 3.2c.8 1.2 2 1.9 3.4 1.9h1.7M14.5 4l2 2-2 2M3.5 14h2.7c.9 0 1.8-.3 2.5-.9M14.5 12l2 2-2 2M11 6.9c.7-.6 1.6-.9 2.5-.9h3" />
  </Icon>
);

export const MenuIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M3 7h14M3 13h9" />
  </Icon>
);

export const CloseIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="m5 5 10 10M15 5 5 15" />
  </Icon>
);

export const PlusIcon = (props: IconProps) => (
  <Icon {...props}>
    <path d="M10 4v12M4 10h12" />
  </Icon>
);

export const InfoIcon = (props: IconProps) => (
  <Icon {...props}>
    <circle cx="10" cy="10" r="7" />
    <path d="M10 9v4.5M10 6.5v.01" />
  </Icon>
);
