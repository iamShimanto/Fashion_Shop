import { apiRequest } from "./apiClient";

export const authApi = {
  register: (payload) =>
    apiRequest("/auth/register", { method: "POST", json: payload }),
  login: (payload) =>
    apiRequest("/auth/login", { method: "POST", json: payload }),
  logout: () => apiRequest("/auth/logout", { method: "GET" }),
  me: () => apiRequest("/auth/me", { method: "GET" }),

  sendVerificationCode: () =>
    apiRequest("/auth/send-verification-code", { method: "GET" }),
  verifyCode: (payload) =>
    apiRequest("/auth/verify-code", { method: "POST", json: payload }),

  sendForgetPasswordCode: (payload) =>
    apiRequest("/auth/send-forget-password-code", {
      method: "POST",
      json: payload,
    }),
  forgetPasswordConfirm: (payload) =>
    apiRequest("/auth/forget-password-confirm", {
      method: "POST",
      json: payload,
    }),

  changePassword: (payload) =>
    apiRequest("/auth/change-password", { method: "POST", json: payload }),

  updateProfile: ({ fullName, phone, address, avaterFile }) => {
    const formData = new FormData();
    if (fullName) formData.append("fullName", fullName);
    if (phone) formData.append("phone", phone);
    if (address) formData.append("address", address);
    if (avaterFile) formData.append("avater", avaterFile);

    return apiRequest("/auth/update-profile", {
      method: "PUT",
      formData,
    });
  },
};
