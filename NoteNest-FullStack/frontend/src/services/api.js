import axios from "axios";

export const TOKEN_KEY = "notenest.token";

// All calls go to "/api/...". In development Vite forwards them to the
// original backend (see vite.config.js), so no backend change is needed.
const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// The original auth middleware reads the raw JWT from the Authorization
// header (it does NOT expect the "Bearer " prefix), so we send it as-is.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = token;
  return config;
});

// Turns any failed request into a sentence a person can act on.
export function describeError(err) {
  if (err?.code === "ECONNABORTED") {
    return "The server took too long to answer. Check that the backend and MongoDB are running.";
  }
  if (!err?.response) {
    return err?.message && !err.isAxiosError
      ? err.message
      : 'Cannot reach the backend. Run "npm run server" inside the backend folder.';
  }
  if (err.response.status >= 500) {
    return `The backend is not responding correctly (status ${err.response.status}). Make sure it is running on port 8080.`;
  }
  return err.response.data?.msg || "Something went wrong. Please try again.";
}

export default api;
