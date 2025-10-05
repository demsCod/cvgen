import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

const extraWatchPaths = [
  "src-tauri/src",
  "python"
];

export default defineConfig({
  plugins: [
    react(),
    {
      name: "cvgen-extra-watch",
      configureServer(server) {
        for (const path of extraWatchPaths) {
          server.watcher.add(path);
        }
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  server: {
    port: 1420,
    strictPort: true,
    host: "0.0.0.0"
  },
  preview: {
    port: 1420,
    host: "0.0.0.0"
  }
});
