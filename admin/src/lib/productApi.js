import api from "./api";

export async function listAdmin(params = {}) {
  const res = await api.get("/products/admin", { params });
  return res.data;
}

export async function getAdminById(id) {
  const res = await api.get(`/products/admin/${id}`);
  return res.data;
}

export async function createProduct(formData) {
  const res = await api.post("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateProduct(id, formData) {
  const res = await api.put(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteProduct(id) {
  const res = await api.delete(`/products/${id}`);
  return res.data;
}
