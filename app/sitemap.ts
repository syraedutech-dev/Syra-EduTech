import type { MetadataRoute } from "next";
import { trainers } from "./data";

const siteUrl = "https://syraedutech.in";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/careers`, changeFrequency: "monthly", priority: 0.6 },
    ...trainers.map((trainer) => ({ url: `${siteUrl}/trainers/${trainer.slug}`, changeFrequency: "monthly" as const, priority: trainer.isLead ? 0.9 : 0.8 })),
  ];
}
