import axios from "axios";

export const api = axios.create({
  baseURL: "https://take-home-test-api.nutech-integrasi.com",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("ppob_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

