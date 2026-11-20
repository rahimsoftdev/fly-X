import { getTokenData } from "@/utils/get.token.util";
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URI,
  withCredentials: true, // authClient.token() সেশন কুকি দিয়ে চলে, তাই এটা লাগবে
});

// প্রতি রিকোয়েস্টে JWT পাঠাও (async, তাই await)
api.interceptors.request.use(async (config) => {
  const token = await getTokenData();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error);
    const message = error.response?.data?.message ?? "Something went wrong";
    return Promise.reject(new Error(message));
  }
);