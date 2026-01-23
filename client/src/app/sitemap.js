import { getApiBaseUrl, getSiteUrl } from "./lib/seo";

async function fetchProductUrls() {
  const apiBase = getApiBaseUrl();
  if (!apiBase) return [];

  const site = getSiteUrl();
  const urls = [];

  const limit = 100;
  const maxPages = 10; // safety cap

  for (let page = 1; page <= maxPages; page += 1) {
    const search = new URLSearchParams();
    search.set("page", String(page));
    search.set("limit", String(limit));
    search.set("sort", "newest");

    const res = await fetch(`${apiBase}/products?${search.toString()}`, {
      cache: "no-store",
    });

    const payload = await res.json().catch(() => null);
    if (!res.ok || payload?.success === false) break;

    const items = payload?.data?.items;
    const meta = payload?.data?.meta;
    if (!Array.isArray(items) || items.length === 0) break;

    for (const p of items) {
      if (p?.slug) {
        urls.push(new URL(`/shop/${p.slug}`, site).toString());
      }
    }

    const pages = Number(meta?.pages || 1);
    if (page >= pages) break;
  }

  return Array.from(new Set(urls));
}

export default async function sitemap() {
  const site = getSiteUrl();
  const now = new Date();

  const staticUrls = [
    "/",
    "/shop",
    "/about",
    "/stories",
    "/contact",
    "/career",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
    "/faqs",
  ].map((p) => new URL(p, site).toString());

  let productUrls = [];
  try {
    productUrls = await fetchProductUrls();
  } catch {
    productUrls = [];
  }

  const all = [...staticUrls, ...productUrls];

  return all.map((url) => ({
    url,
    lastModified: now,
    changeFrequency: url.includes("/shop/") ? "weekly" : "monthly",
    priority:
      url === new URL("/", site).toString()
        ? 1
        : url === new URL("/shop", site).toString()
          ? 0.9
          : 0.6,
  }));
}
