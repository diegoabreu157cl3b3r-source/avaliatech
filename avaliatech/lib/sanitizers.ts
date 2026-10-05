export function cleanText(value: string) {
  return value
    .replace(/[<>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function cleanEmail(value: string) {
  return cleanText(value).toLowerCase();
}

export function cleanOptionalText(value?: string | null) {
  if (!value) return "";
  return cleanText(value);
}
