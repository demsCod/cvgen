import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

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
