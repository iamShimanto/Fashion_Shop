import { apiRequest } from "./apiClient";

export const orderApi = {
  create: ({ items, shippingAddress, shippingMethod, note, paymentMethod }) =>
    apiRequest("/orders", {
      method: "POST",
      json: { items, shippingAddress, shippingMethod, note, paymentMethod },
    }),

  my: (params = {}) => {
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v === undefined || v === null || v === "") continue;
      search.set(k, String(v));
    }
    const qs = search.toString();
    return apiRequest(`/orders/my${qs ? `?${qs}` : ""}`, { method: "GET" });
  },

  myById: (id) => apiRequest(`/orders/my/${id}`, { method: "GET" }),
};
