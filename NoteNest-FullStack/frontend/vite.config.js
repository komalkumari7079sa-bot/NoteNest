import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// The faculty backend has no CORS configuration, so a browser on
// http://localhost:5173 cannot call http://localhost:8080 directly.
// Instead of editing the backend, Vite forwards every request that starts
// with /api to the backend and strips the "/api" prefix:
//   frontend calls  /api/user/login  ->  backend receives  /user/login
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const target = env.VITE_API_URL || "http://localhost:8080";

  const proxy = {
    "/api": {
      target,
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ""),
    },
  };

  return {
    plugins: [react()],
    server: { port: 5173, proxy },
    preview: { port: 4173, proxy },
  };
});
