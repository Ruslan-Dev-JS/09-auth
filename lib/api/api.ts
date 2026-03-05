import axios from "axios";

const baseUrl =
  (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000") + "/api";

export const api = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

