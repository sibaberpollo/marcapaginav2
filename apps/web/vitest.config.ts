import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./__tests__/setup/vitest.setup.ts"],
    globals: true,
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
    cache: false,
  },
});
