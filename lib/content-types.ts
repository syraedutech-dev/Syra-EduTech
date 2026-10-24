export type Kind = "trainer" | "testimonial" | "gallery" | "feedback";
export type ContentRecord = { id: string; kind: Kind; payload: Record<string, string>; published: boolean; createdAt: string };
export function isImageUrl(value: string) {
  if (value.startsWith("/") && !value.startsWith("//")) return true;
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
