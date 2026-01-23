import api from "./api";

export async function listAdmin(params = {}) {
  const res = await api.get("/orders/admin", { params });
  return res.data;
}

export async function getAdminById(id) {
  const res = await api.get(`/orders/admin/${id}`);
  return res.data;
}

export async function updateAdmin(id, payload) {
  const res = await api.put(`/orders/admin/${id}`, payload);
  return res.data;
}

export async function analytics() {
  const res = await api.get("/orders/admin/analytics");
  return res.data;
}
