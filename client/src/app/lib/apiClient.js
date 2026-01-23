const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE_URL =
  typeof rawBaseUrl === "string"
    ? rawBaseUrl.replace(/^['"]|['"]$/g, "").trim()
    : rawBaseUrl;

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

export async function apiRequest(path, options = {}) {
  if (!API_BASE_URL) {
    // Fallback helps avoid a hard crash in dev when env is misconfigured.
    // Prefer setting NEXT_PUBLIC_API_BASE_URL in client/.env.development.
    throw new ApiError(
      "NEXT_PUBLIC_API_BASE_URL is not set. Set it (example: http://localhost:5000/api).",
    );
  }

  const url = `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

  const {
    method = "GET",
    headers = {},
    body,
    json,
    formData,
    credentials = "include",
    cache = "no-store",
  } = options;

  const finalHeaders = new Headers(headers);

  let finalBody = body;

  if (json !== undefined) {
    finalHeaders.set("Content-Type", "application/json");
    finalBody = JSON.stringify(json);
  }

  if (formData) {
    finalBody = formData;
    finalHeaders.delete("Content-Type");
  }

  const res = await fetch(url, {
    method,
    headers: finalHeaders,
    body: finalBody,
    credentials,
    cache,
  });

  const payload = await parseJsonSafe(res);

  if (!res.ok) {
    const message = payload?.message || `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, payload });
  }

  if (payload && payload.success === false) {
    throw new ApiError(payload.message || "Request failed", {
      status: res.status,
      payload,
    });
  }

  return payload;
}
