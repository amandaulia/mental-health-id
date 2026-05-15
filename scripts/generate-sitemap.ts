/**
 * Pre-build / pre-dev hook: writes public/sitemap.xml.
 *
 * Lists all static routes plus every practitioner / institution / peer-counseling /
 * organization detail page from Supabase. Falls back to static-only routes if
 * Supabase env vars are missing or the fetch fails (so local dev never blocks).
 */
import { writeFileSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://mentalhealthid.lovable.app";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/professional-counseling", changefreq: "weekly", priority: "1.0" },
  { path: "/peer-counseling", changefreq: "weekly", priority: "0.8" },
  { path: "/stress-relief", changefreq: "weekly", priority: "0.7" },
  { path: "/organizations", changefreq: "weekly", priority: "0.7" },
  { path: "/about", changefreq: "monthly", priority: "0.4" },
];

async function fetchDynamicEntries(): Promise<SitemapEntry[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    console.warn("[sitemap] Supabase env vars missing — skipping dynamic entries");
    return [];
  }

  const supabase = createClient(url, key);
  const entries: SitemapEntry[] = [];

  const sources: Array<{ table: string; pathPrefix: string }> = [
    { table: "practitioner", pathPrefix: "/practitioner" },
    { table: "institution", pathPrefix: "/bureau" },
    { table: "peer_counseling", pathPrefix: "/peer-counseling" },
    { table: "organization", pathPrefix: "/organizations" },
  ];

  for (const { table, pathPrefix } of sources) {
    const { data, error } = await supabase
      .from(table as any)
      .select("id, last_updated_at")
      .limit(2000);

    if (error) {
      console.warn(`[sitemap] Failed to fetch ${table}:`, error.message);
      continue;
    }

    for (const row of data || []) {
      entries.push({
        path: `${pathPrefix}/${(row as any).id}`,
        lastmod: (row as any).last_updated_at?.split?.("T")?.[0],
        changefreq: "weekly",
        priority: "0.6",
      });
    }
  }

  return entries;
}

function generateSitemap(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

async function main() {
  const dynamic = await fetchDynamicEntries();
  const entries = [...staticEntries, ...dynamic];
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
  console.log(`sitemap.xml written (${entries.length} entries)`);
}

main().catch((err) => {
  console.error("[sitemap] Generation failed:", err);
  // Always write at least the static sitemap so the build doesn't break.
  writeFileSync(resolve("public/sitemap.xml"), generateSitemap(staticEntries));
  process.exit(0);
});