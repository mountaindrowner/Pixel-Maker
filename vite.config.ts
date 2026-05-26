import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { pixelMakerServer } from "./app/vite.server";

export default defineConfig({
  root: "app",
  plugins: [react(), pixelMakerServer({ projectsDir: "../projects" })],
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
});
