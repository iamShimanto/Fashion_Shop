import { apiRequest } from "./apiClient";

export const productApi = {
  list: (params = {}) => {
    const search = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      search.set(key, String(value));
    }

    const qs = search.toString();
    return apiRequest(`/products${qs ? `?${qs}` : ""}`, { method: "GET" });
  },

  getBySlug: (slug) => apiRequest(`/products/slug/${slug}`, { method: "GET" }),
};
