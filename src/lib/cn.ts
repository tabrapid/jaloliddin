type ClassValue = string | false | null | undefined;

/** Joins truthy class names. Variants are designed not to conflict, so no merge step is needed. */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
