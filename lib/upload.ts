export function parseDataUrl(dataUrl?: string | null) {
  if (!dataUrl) return null;
  const match = dataUrl.match(/^data:(image\/(png|jpeg|jpg));base64,(.+)$/);
  if (!match) return null;

  const mime = match[1] === "image/jpg" ? "image/jpeg" : match[1];
  return {
    mime: mime as "image/png" | "image/jpeg",
    base64: match[3],
    bytes: Uint8Array.from(Buffer.from(match[3], "base64"))
  };
}

export function isValidLogo(dataUrl?: string | null) {
  if (!dataUrl) return true;
  const parsed = parseDataUrl(dataUrl);
  if (!parsed) return false;
  const maxSizeBytes = 2 * 1024 * 1024;
  return parsed.bytes.length <= maxSizeBytes;
}
