import api from "./api";

export async function listAdmin(params = {}) {
  const res = await api.get("/users/admin", { params });
  return res.data;
}

export async function getAdminById(id) {
  const res = await api.get(`/users/admin/${id}`);
  return res.data;
}

export async function updateAdmin(id, payload) {
  const res = await api.put(`/users/admin/${id}`, payload);
  return res.data;
}

export async function deleteAdmin(id) {
  const res = await api.delete(`/users/admin/${id}`);
  return res.data;
}
