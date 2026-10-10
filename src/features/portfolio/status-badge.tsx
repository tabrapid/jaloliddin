import { Badge, type BadgeTone } from "@/components/ui/badge";
import type { ProjectStatus } from "@/types/content";

const tones: Record<ProjectStatus, BadgeTone> = {
  concept: "outline",
  "in-development": "accent",
  prototype: "accent",
  live: "success",
};

export function StatusBadge({ status, label }: { status: ProjectStatus; label: string }) {
  return (
    <Badge tone={tones[status]} dot data-status={status}>
      {label}
    </Badge>
  );
}
