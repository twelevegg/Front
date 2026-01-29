import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // refreshToken을 httpOnly cookie로 쓸 때만 켜세요
});

export default api;
