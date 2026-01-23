function cleanUrl(value) {
  if (typeof value !== "string") return "";
  return value.replace(/^['"]|['"]$/g, "").trim();
}

function normalizeApiBaseUrl(raw) {
  const cleaned = cleanUrl(raw);
  if (!cleaned) return "";

  const withProtocol = cleaned.startsWith("http")
    ? cleaned
    : `https://${cleaned}`;

  try {
    const url = new URL(withProtocol);
    // Remove trailing slashes
    url.pathname = url.pathname.replace(/\/+$/g, "");
    if (url.pathname === "" || url.pathname === "/") {
      url.pathname = "/api";
    }
    return url.toString().replace(/\/+$/g, "");
  } catch {
    // Fall back to cleaned value as-is (caller can decide what to do)
    return cleaned.replace(/\/+$/g, "");
  }
}

export function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    "https://fashion.shimanto.dev";

  const cleaned = cleanUrl(raw);
  const withProtocol = cleaned.startsWith("http")
    ? cleaned
    : `https://${cleaned}`;

  try {
    return new URL(withProtocol);
  } catch {
    return new URL("https://fashion.shimanto.dev");
  }
}

export function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return getSiteUrl().toString();
  const s = String(pathOrUrl);
  if (s.startsWith("http://") || s.startsWith("https://")) return s;
  const base = getSiteUrl();
  return new URL(s.startsWith("/") ? s : `/${s}`, base).toString();
}

export function getApiBaseUrl() {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return normalizeApiBaseUrl(raw);
}
