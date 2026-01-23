export function parseCommaList(value) {
  return String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function safeJsonParse(value, fallback) {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

export function buildProductFormData(values, files = []) {
  const fd = new FormData();

  Object.entries(values).forEach(([k, v]) => {
    if (v === undefined || v === null) return;

    if (typeof v === "string") {
      fd.append(k, v);
      return;
    }

    if (typeof v === "number") {
      fd.append(k, String(v));
      return;
    }

    if (Array.isArray(v) || typeof v === "object") {
      fd.append(k, JSON.stringify(v));
      return;
    }

    fd.append(k, String(v));
  });

  for (const file of files) {
    fd.append("images", file);
  }

  return fd;
}
