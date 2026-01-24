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

export function buildProductFormData(
  values,
  { newImages = [], replaceBySerial = {} } = {},
) {
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

  for (const file of newImages) {
    fd.append("images", file);
  }

  for (const [serial, file] of Object.entries(replaceBySerial || {})) {
    if (!file) continue;
    const s = Number(serial);
    if (!Number.isFinite(s) || s <= 0) continue;
    fd.append(`replace_serial_${s}`, file);
  }

  return fd;
}
