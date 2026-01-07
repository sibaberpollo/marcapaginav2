import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import dts from "vite-plugin-dts";
import tailwindcss from "@tailwindcss/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.json",
    }),
    tailwindcss(),
  ],
  build: {
    lib: {
      entry: join(__dirname, "src/index.ts"),
      name: "MarcapaginaDS",
      formats: ["es", "cjs"],
      fileName: (format, name) => {
        if (format === "es") return `${name}/index.js`;
        return `${name}/index.js`;
      },
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
        exports: "named",
      },
    },
  },
  resolve: {
    alias: {
      "@": join(__dirname, "./src"),
    },
  },
});
