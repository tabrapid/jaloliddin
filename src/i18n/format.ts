export type TemplateValues = Record<string, string | number>;

/** Replaces {name} placeholders. Unknown placeholders are left untouched. */
export function format(template: string, values: TemplateValues = {}): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
