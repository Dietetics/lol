import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/",
  plugins: [react()],
  server: {
    allowedHosts: [
      "https://cc17da90-f18b-47f9-9881-3bfc7ebd9935-00-37jve81mjo8m2.worf.replit.dev/",
    ],
  },
});
